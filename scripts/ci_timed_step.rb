#!/usr/bin/env ruby
# frozen_string_literal: true

require "time"

stage = ARGV.shift
limit = Integer(ARGV.shift || "0", exception: false)
separator = ARGV.shift
command = ARGV

if stage.to_s.empty? || limit.nil? || limit <= 0 || separator != "--" || command.empty?
  warn "uso: ruby scripts/ci_timed_step.rb STAGE TIMEOUT_SECONDS -- comando [args...]"
  exit 2
end

def stamp
  Time.now.utc.iso8601
end

started_monotonic = Process.clock_gettime(Process::CLOCK_MONOTONIC)
total_limit = Integer(ENV.fetch("CI_TOTAL_TIMEOUT_SECONDS", "0"), exception: false).to_i
state_path = ENV.fetch("CI_TIMER_STATE", ".ci-timer-start")

if total_limit.positive?
  global_started = if File.file?(state_path)
    Float(File.read(state_path))
  else
    File.write(state_path, started_monotonic.to_s)
    started_monotonic
  end
  global_elapsed = started_monotonic - global_started
  remaining = total_limit - global_elapsed

  if remaining <= 0
    puts "[ci-time] #{stamp} GLOBAL_TIMEOUT stage=#{stage.inspect} elapsed=#{global_elapsed.round(1)}s limit=#{total_limit}s"
    puts "::error title=Timeout global do workflow::Limite global de #{total_limit}s atingido antes da etapa #{stage.inspect}; decorrido #{global_elapsed.round(1)}s."
    exit 124
  end

  limit = [limit, remaining.ceil].min
end

puts "[ci-time] #{stamp} START stage=#{stage.inspect} timeout=#{limit}s"
process_group = !Gem.win_platform?
spawn_options = process_group ? { pgroup: true } : {}
pid = Process.spawn(*command, spawn_options)
kill_target = process_group ? -pid : pid
timed_out = false
status = nil

loop do
  waited_pid = nil

  begin
    waited_pid, status = Process.wait2(pid, Process::WNOHANG)
  rescue Errno::ECHILD
    break
  end

  break if waited_pid

  duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_monotonic
  if duration >= limit
    timed_out = true
    break
  end

  sleep 0.2
end

if timed_out
  duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_monotonic
  puts "[ci-time] #{stamp} TIMEOUT stage=#{stage.inspect} duration=#{duration.round(1)}s timeout=#{limit}s"
  puts "::error title=Timeout de etapa::Etapa #{stage.inspect} excedeu #{limit}s; duração #{duration.round(1)}s."

  unless Gem.win_platform?
    begin
      Process.kill("TERM", kill_target)
    rescue Errno::ESRCH
      # Processo encerrado entre o timeout e o sinal.
    end

    sleep 3
  end

  begin
    Process.kill("KILL", kill_target)
  rescue Errno::ESRCH, Errno::EINVAL
    # Processo já encerrado após TERM.
  end

  begin
    Process.wait(pid)
  rescue Errno::ECHILD
    # Processo já coletado.
  end
end

duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_monotonic

if timed_out
  exit 124
end

exit_code = status&.exitstatus || 1
puts "[ci-time] #{stamp} END stage=#{stage.inspect} duration=#{duration.round(1)}s status=#{exit_code}"
exit exit_code
