function processData(csv, china) {

  // prettier-ignore
  const abbrById = 
  {'110000': 'Beijing',
  '120000': 'Tianjin',
  '130000': 'Hebei',
  '140000': 'Shanxi',
  '150000': 'Inner Mongolia',
  '210000': 'Liaoning',
  '220000': 'Jilin',
  '230000': 'Heilongjiang',
  '310000': 'Shanghai',
  '320000': 'Jiangsu',
  '330000': 'Zhejiang',
  '340000': 'Anhui',
  '350000': 'Fujian',
  '360000': 'Jiangxi',
  '370000': 'Shandong',
  '410000': 'Henan',
  '420000': 'Hubei',
  '430000': 'Hunan',
  '440000': 'Guangdong',
  '450000': 'Guangxi',
  '460000': 'Hainan',
  '500000': 'Chongqing',
  '510000': 'Xichuan',
  '520000': 'Guizhou',
  '530000': 'Yunnan',
  '540000': 'Tibet',
  '610000': 'Shaanxi',
  '620000': 'Gansu',
  '630000': 'Qinghai',
  '640000': 'Ningxia',
  '650000': 'Xinjiang',
  '710000': 'Taiwan',
  '810000': 'Hong Kong',
  '820000': 'Macao',}

  //console.log(us);

  // filter undefined country id
  // us.objects.geo.geometries = us.objects.geo.geometries.filter((d)=>{
  //   return Object.hasOwnProperty.call(d,"id");
  // })

  // country.objects.countries.geometries = country.objects.countries.geometries.filter((d)=>{
  //   return Object.hasOwnProperty.call(d,'id');
  // })

  //console.log(us);

  china.features.forEach(
    (d) => (d.properties.eng_name = abbrById[d.properties.adcode])
  )

  const idByName = new Map(
    china.features.map((d) => [d.properties.eng_name, d.properties.adcode])
  );

  
  const links = []; //array of object storing Source (id), Target (id) and Value (int)
  csv.forEach((d) => {
    links.push({
      source: idByName.get(d.source_ISO),
      target: idByName.get(d.target_ISO),
      value: +d.value,
    });
  });

  const inbounds = d3.group(links, (d) => d.target);
  const outbounds = d3.group(links, (d) => d.source);

  const nodes = china.features.map((d) => {
    const name = d.properties.eng_name;
    const id = d.properties.adcode;
    return {
      name,
      id,
      inbounds: inbounds.get(id) ? inbounds.get(id).sort((a, b) => d3.descending(a.value, b.value)) : [],
      inboundsTotal: inbounds.get(id) ? d3.sum(inbounds.get(id), (d) => d.value) : 0,
      outbounds: outbounds.get(id) ? outbounds.get(id).sort((a, b) => d3.descending(a.value, b.value)) : [],
      outboundsTotal: outbounds.get(id) ? d3.sum(outbounds.get(id), (d) => d.value) : 0,
    };

  })

  console.log("nodes: ");
  console.log(nodes);
  console.log("links: ");
  console.log(links);

  return { nodes, links };
}
