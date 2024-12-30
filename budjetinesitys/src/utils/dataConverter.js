export function convertCsvDataToSankeyData(csvData) {
  if (Object.keys(csvData).length === 0) {
    console.log("No CSV data available for Sankey diagram.");
    return null;
  }

  let incomeData = [];
  let expenditureData = [];

  for (const [key, value] of Object.entries(csvData)) {
    if (value.length > 0) {
      const firstRow = value[0];
      if (Object.keys(firstRow).some(col => col.toLowerCase().includes('tulomomentin'))) {
        incomeData = incomeData.concat(value);
      } else if (Object.keys(firstRow).some(col => col.toLowerCase().includes('menomomentin'))) {
        expenditureData = expenditureData.concat(value);
      } else {
        console.warn(`CSV file ${key} does not match income or expenditure criteria.`);
      }
    } else {
      console.warn(`CSV file ${key} is empty or has no data.`);
    }
  }

  //console.log('Income Data:', incomeData);
  //console.log('Expenditure Data:', expenditureData);

  if (incomeData.length === 0 || expenditureData.length === 0) {
    console.log("Missing either income or expenditure data.");
    return null;
  }
// make incomeData array only 5 rows
//    incomeData = incomeData.slice(0, 30);
   // expenditureData = expenditureData.slice(0, 5);

  // Create nodes for income, "TheState", and expenditure
  const incomeNodes = [...new Set(incomeData.map(d => d['Tulomomentin nimi']))];
  const expenditureNodes = [...new Set(expenditureData.map(d => d['Menomomentin nimi']))];
  let datanodes = [
    ...incomeNodes.map(name => ({ name })),
    { name: "TheState" },
    ...expenditureNodes.map(name => ({ name }))
  ];
  //console.log('Nodes before filtering:', datanodes);
  
  datanodes = datanodes.filter(node=> node.name != undefined)
  console.log('Nodes after filtering :', datanodes);


  // Create links from income to "TheState" and from "TheState" to expenditure
  const links = [
    ...incomeData.map(d => ({
      source: datanodes.findIndex(node => node.name === d['Tulomomentin nimi']),
      target: datanodes.findIndex(node => node.name === "TheState"),
      value: parseInt(d['M��r�raha'] || 0)
    })),
    ...expenditureData.map(d => ({
      source: datanodes.findIndex(node => node.name === "TheState"),
      target: datanodes.findIndex(node => node.name === d['Menomomentin nimi']),
      value: parseInt(d['M��r�raha'] || 0)
    }))
  ];

console.log('Links before filtering:', links);

  const nodesWithValues = datanodes.map((node, index) => {
    const incoming = links.filter(l => l.target === index).reduce((sum, link) => sum + link.value, 0);
    const outgoing = links.filter(l => l.source === index).reduce((sum, link) => sum + link.value, 0);
    return {
      ...node,
      value: Math.max(incoming, outgoing) // or sum them if that fits your data model
    };
  });
  console.log('Links after filtering:', links.filter(link => !isNaN(link.value) && link.value > 0));
  return { nodes: nodesWithValues, links: links.filter(link => !isNaN(link.value) && link.value > 0) };
}