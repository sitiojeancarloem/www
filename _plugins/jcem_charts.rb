# frozen_string_literal: true

# Fonte: https://github.com/sitiojeancarloem/blog
# Autor: Jean Carlo EM — https://www.jeancarloem.com
# Licença: MPL-2.0 — https://mozilla.org/MPL/2.0/

require "cgi"
require "csv"
require "json"
require "pathname"
require "jekyll"

module Jcem
  module Charts
    VERSION = "4.5.1"
    TYPES = %w[bar line pie doughnut radar polarArea].freeze
    PALETTE = ["#2b92db", "#f4d400", "#8bc34a", "#f27b86", "#9c7adf"].freeze

    module_function

    def fatal(message)
      raise Jekyll::Errors::FatalException, "jcem_chart=#{message}"
    end

    def source_path(root, reference)
      clean = reference.to_s.tr("\\", "/").sub(%r{\A/+}, "")
      fatal("referencia_invalida") if clean.empty? || clean.split("/").include?("..")

      root_path = Pathname.new(root).realpath
      path = root_path.join(clean).cleanpath
      fatal("referencia_externa path=#{clean}") unless path.to_s.start_with?("#{root_path}#{File::SEPARATOR}")
      fatal("dataset_ausente path=#{clean}") unless path.file?

      path
    end

    def load_csv(path)
      rows = CSV.read(path, headers: true, encoding: "bom|utf-8")
      fatal("csv_sem_dados path=#{path}") if rows.empty? || rows.headers.length < 2

      {
        "id" => File.basename(path, ".csv"),
        "type" => "line",
        "title" => File.basename(path, ".csv").tr("-_", " "),
        "summary" => "Dados tabulares do gráfico.",
        "conclusion" => "Consulte os valores e a fonte editorial associados.",
        "labels" => rows.map { |row| row[0].to_s },
        "datasets" => rows.headers.drop(1).map do |header|
          { "label" => header.to_s, "data" => rows.map { |row| row[header] } }
        end
      }
    end

    def load_dataset(root, reference)
      path = source_path(root, reference)
      raw = case path.extname.downcase
            when ".json" then JSON.parse(path.read(encoding: "UTF-8"))
            when ".csv" then load_csv(path)
            else fatal("formato_invalido path=#{reference}")
            end

      normalize(raw, reference)
    rescue JSON::ParserError, CSV::MalformedCSVError => error
      fatal("dataset_invalido path=#{reference} detalhe=#{error.message}")
    end

    def required_text(payload, key, reference)
      value = payload[key].to_s.strip
      fatal("campo_ausente path=#{reference} campo=#{key}") if value.empty?
      value
    end

    def normalize(payload, reference)
      fatal("raiz_invalida path=#{reference}") unless payload.is_a?(Hash)

      type = payload.fetch("type", "line").to_s
      fatal("tipo_invalido path=#{reference} tipo=#{type}") unless TYPES.include?(type)
      labels = Array(payload["labels"]).map { |label| label.to_s.strip }
      fatal("rotulos_invalidos path=#{reference}") if labels.empty? || labels.any?(&:empty?)
      datasets = Array(payload["datasets"])
      fatal("series_ausentes path=#{reference}") if datasets.empty?

      normalized_datasets = datasets.each_with_index.map do |dataset, index|
        fatal("serie_invalida path=#{reference} indice=#{index}") unless dataset.is_a?(Hash)
        values = Array(dataset["data"])
        fatal("cardinalidade_invalida path=#{reference} indice=#{index}") unless values.length == labels.length
        numbers = values.map do |value|
          number = Float(value)
          fatal("valor_invalido path=#{reference} indice=#{index}") unless number.finite?
          number
        rescue ArgumentError, TypeError
          fatal("valor_invalido path=#{reference} indice=#{index}")
        end
        color = dataset["color"].to_s.strip
        color = PALETTE[index % PALETTE.length] if color.empty?
        {
          "label" => required_text(dataset, "label", reference),
          "data" => numbers,
          "borderColor" => color,
          "backgroundColor" => color,
          "borderWidth" => 2
        }
      end

      {
        "id" => required_text(payload, "id", reference),
        "type" => type,
        "title" => required_text(payload, "title", reference),
        "summary" => required_text(payload, "summary", reference),
        "conclusion" => required_text(payload, "conclusion", reference),
        "source" => payload["source"].to_s.strip,
        "labels" => labels,
        "datasets" => normalized_datasets
      }
    end

    def escape(value)
      CGI.escapeHTML(value.to_s)
    end

    def json_script(payload)
      JSON.generate(payload).gsub("</", "<\\/")
    end

    def render(payload, emit_assets:)
      id = payload["id"].gsub(/[^a-zA-Z0-9_-]+/, "-")
      config = {
        "type" => payload["type"],
        "data" => { "labels" => payload["labels"], "datasets" => payload["datasets"] },
        "options" => {
          "responsive" => true,
          "maintainAspectRatio" => false,
          "animation" => false,
          "plugins" => { "title" => { "display" => false } }
        }
      }
      headings = payload["datasets"].map { |dataset| "<th scope=\"col\">#{escape(dataset["label"])}</th>" }.join
      rows = payload["labels"].each_with_index.map do |label, index|
        values = payload["datasets"].map { |dataset| "<td>#{escape(dataset["data"][index])}</td>" }.join
        "<tr><th scope=\"row\">#{escape(label)}</th>#{values}</tr>"
      end.join
      source = payload["source"].empty? ? "" : %(<p class="jcem-chart__source">Fonte: #{escape(payload["source"])}</p>)
      assets = if emit_assets
                 %(<script src="/assets/jcem/lib/chartjs/chart.umd.min.js" defer data-jcem-chart-renderer="#{VERSION}"></script><script src="/assets/jcem/js/chart-adapter.js" defer data-jcem-chart-adapter></script>)
               else
                 ""
               end

      <<~HTML
        <figure class="jcem-chart" id="jcem-chart-#{escape(id)}" data-jcem-chart data-jcem-chart-version="#{VERSION}">
          <figcaption><strong>#{escape(payload["title"])}</strong><span class="jcem-chart__summary">#{escape(payload["summary"])}</span></figcaption>
          <div class="jcem-chart__canvas" aria-hidden="true"><canvas data-jcem-chart-canvas role="presentation"></canvas></div>
          <p class="jcem-chart__conclusion">#{escape(payload["conclusion"])}</p>
          #{source}
          <details class="jcem-chart__data"><summary>Dados do gráfico</summary><table><caption>#{escape(payload["title"])} — dados</caption><thead><tr><th scope="col">Categoria</th>#{headings}</tr></thead><tbody>#{rows}</tbody></table></details>
          <script type="application/json" data-jcem-chart-config>#{json_script(config)}</script>
        </figure>
        #{assets}
      HTML
    end
  end

  class ChartTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @reference = markup.to_s.strip.sub(/\A(["'])(.*)\1\z/, "\\2")
      Charts.fatal("sintaxe_invalida") if @reference.empty?
    end

    def render(context)
      site = context.registers[:site]
      Charts.fatal("site_ausente") unless site
      emitted = context.registers[:jcem_chart_assets_emitted] == true
      context.registers[:jcem_chart_assets_emitted] = true
      Charts.render(Charts.load_dataset(site.source, @reference), emit_assets: !emitted)
    end
  end
end

Liquid::Template.register_tag("jcem_chart", Jcem::ChartTag)
