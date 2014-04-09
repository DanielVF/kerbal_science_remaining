def rotate_rows(rows)
    out_rows = []
    rows.first.size.times do |col_i|
        out_rows[col_i] = []
        rows.size.times do |row_i|
            out_rows[col_i][row_i] = rows[row_i][col_i]
        end
    end
    return out_rows
end

def read_tsv(file, options={})
    rows = []
    File.open(file, 'r') do |f| 
        f.read().each_line do |l|
            rows.push l.strip.split("\t").map{|x| x.strip}
        end
    end
    if not options[:rotate].nil?
        rows = rotate_rows(rows)
    end
    headers = rows.shift
    headers.shift
    
    data = {}
    for row in rows
        row_data = {}
        row_title = row.shift
        for field in headers
            value = row.shift
            row_data[field] = value if not value.nil?
        end
        data[row_title] = row_data
    end
    return data
end


MULTIPLIER_FIELDS = {
    'Surface: Landed' => 'Surface multiplier',
    'Surface: Splashed' => 'Surface multiplier',
    'Flying Low' => 'Atmosphere multiplier',
    'Flying High' => 'Atmosphere multiplier',
    'In Space Low' => 'Low space multiplier',
    'In Space High' => 'Low space multiplier'
}

def body_multiplier(body, situation)
    value = body[MULTIPLIER_FIELDS[situation]]
    return nil if value == "N/A"
    return value.to_f
end

def body_has_atmosphere?(body)
    return body['Atmosphere multiplier'] != 'N/A'
end

def valid_expiriment?(module_name, module_data, biome, biome_data, body, situation, situation_data)
    # return false if not module_name == "Temperature Scan"
    multiplier = body_multiplier(body, situation)
    return false if multiplier.nil?
    return false if biome_data['SURFACE_ONLY'] and not situation.start_with?("Surface")
    return false if module_data['Atmosphere Required'] == 'Y' and not body_has_atmosphere?(body)
    
    type = situation_data[module_name]
    if type == "Global"
        return biome_data['Body'] == biome # Only on main planet
    elsif type == "Biome"
        return biome_data['Body'] != biome # On all biome, but not main planet
    end
    
    # p situations
    return false
end

def science_value(module_name, module_data, situation, body)
    return body_multiplier(body, situation) * module_data['Base value'].to_f
end

def max_science_value(module_name, module_data, situation, body)
    return body_multiplier(body, situation) * module_data['Maximum value'].to_f
end


modules = read_tsv 'modules.tsv', :rotate => true
bodies = read_tsv 'bodies.tsv'
biomes = read_tsv 'biomes.tsv'
situations = read_tsv 'situations.tsv'

for body, body_data in bodies
    biomes[body] = {"Biome"=>body,"Body"=>body,}
end


for biome, biome_data  in biomes
    body = bodies[biome_data["Body"]]
    for module_name, module_data in modules
        for situation, situation_data in situations
            next if biome == "Water" and situation == "Surface: Landed"
            next if biome != "Water" and situation == "Surface: Splashed"
            next unless valid_expiriment?(module_name, module_data, biome, biome_data, body, situation, situation_data)
            science = science_value(module_name, module_data, situation, body)
            science_max = max_science_value(module_name, module_data, situation, body)
            puts [biome_data["Body"], biome_data["Biome"], module_name, module_data['Tech level'], situation, science, science_max].join(",")
        end
    end
end




# p situations
# p biomes
# p modules
# p bodies