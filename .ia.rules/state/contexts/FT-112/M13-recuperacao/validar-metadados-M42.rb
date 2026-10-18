require 'json'
require 'yaml'
require 'digest'
require 'open3'
require 'time'
root=File.expand_path('../../../../..',__dir__)
at=->(n){File.join(__dir__,n)}
target=at.call('validacao-metadados-M42.json')
raise 'Relatório não pending' unless JSON.parse(File.read(target))['status']=='pending'
result={status:'failed',limit:'YAML, imagem e identidade exata do corpo; não novo build/render/teste de site.'}
begin
 relative='_drafts/carta-aberta-hierarquia-papal-na-igreja/carta-aberta-hierarquia-papal-na-igreja.md'
 current=File.binread(File.join(root,relative)).force_encoding('UTF-8')
 old,err,status=Open3.capture3('C:/Program Files/Git/cmd/git.exe','show','dd4c775688:'+relative,chdir:root)
 raise 'Base Git indisponível: '+err unless status.success?
 old=old.force_encoding('UTF-8')
 receipt=JSON.parse(File.read(at.call('aplicacao-M42-metadados.json')))
 raise 'Recibo divergente' unless receipt['regions'].length==1 && receipt['before']==Digest::SHA256.hexdigest(old) && receipt['after']==Digest::SHA256.hexdigest(current)
 edit=receipt['regions'][0]
 raise 'Mudança fora do metadado autorizado' unless edit['kind']=='mechanical' && old.sub(edit['before'],edit['after'])==current
 pattern=/\A(?:\uFEFF)?---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|\z)/m
 fm=current.match(pattern);previous=old.match(pattern)
 raise 'YAML delimitado ausente' unless fm && previous
 body=current[fm.end(0)..];previous_body=old[previous.end(0)..]
 raise 'Corpo foi alterado' unless body==previous_body
 data=YAML.safe_load(fm[1],permitted_classes:[],aliases:false)
 %w[title author date last_modified_at description abstract source header categories tags toc toc_label].each{|k|raise 'Campo ausente: '+k unless data.key?(k)}
 raise 'Título/autor divergente' unless data['title']=='Carta aberta: a hierarquia papal na Igreja Adventista' && data['author']=='jeancarlo'
 %w[description abstract source toc_label].each{|k|raise 'Campo vazio: '+k if data[k].to_s.strip.empty?}
 raise 'TOC desativado' unless data['toc']==true
 raise 'Imagem divergente' unless data['header'].is_a?(Hash) && data['header']['image']=='/assets/images/posts/carta-aberta-hierarquia-papal-na-igreja/cover.png' && data['header']['image_description']==data['title']
 raise 'Imagem ausente' unless File.file?(File.join(root,data['header']['image'].delete_prefix('/')))
 raise 'Taxonomia inválida' unless data['categories'].is_a?(Array) && data['categories'].include?('religião') && data['tags'].is_a?(Array) && !data['tags'].empty?
 modified=Time.iso8601(data['last_modified_at']);created=Time.iso8601(data['date'])
 raise 'Data inválida' unless created<=modified && modified<=Time.now+60
 result.merge!(status:'passed',sha256_draft:Digest::SHA256.hexdigest(current),sha256_body:Digest::SHA256.hexdigest(body),body_unchanged_from_M40:true,last_modified_at:data['last_modified_at'],image_exists:true,yaml_valid:true)
rescue StandardError=>e
 result[:error]=e.message
end
File.write(target,JSON.pretty_generate(result),encoding:'UTF-8');puts JSON.generate(result)
exit(result[:status]=='passed' ? 0 : 1)
