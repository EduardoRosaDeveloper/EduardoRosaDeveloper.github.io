// Unit conversion system with configurable precision

// Define all unit categories and their conversion factors
const unitCategories = {
    pressure: {
        name: 'Pressão',
        units: {
            'bar': { name: 'BAR', toBase: 1 },
            'pa': { name: 'Pascal (Pa)', toBase: 0.00001 },
            'kpa': { name: 'Kilopascal (kPa)', toBase: 0.01 },
            'mpa': { name: 'Megapascal (MPa)', toBase: 10 },
            'psi': { name: 'PSI', toBase: 0.0689476 },
            'atm': { name: 'Atmosfera (atm)', toBase: 1.01325 },
            'mmhg': { name: 'Milímetro de Mercúrio (mmHg)', toBase: 0.00133322 },
            'torr': { name: 'Torr', toBase: 0.00133322 }
        }
    },
    length: {
        name: 'Comprimento',
        units: {
            'm': { name: 'Metro (m)', toBase: 1 },
            'km': { name: 'Quilômetro (km)', toBase: 1000 },
            'cm': { name: 'Centímetro (cm)', toBase: 0.01 },
            'mm': { name: 'Milímetro (mm)', toBase: 0.001 },
            'mi': { name: 'Milha (mi)', toBase: 1609.34 },
            'yd': { name: 'Jarda (yd)', toBase: 0.9144 },
            'ft': { name: 'Pé (ft)', toBase: 0.3048 },
            'in': { name: 'Polegada (in)', toBase: 0.0254 }
        }
    },
    weight: {
        name: 'Massa',
        units: {
            'kg': { name: 'Quilograma (kg)', toBase: 1 },
            'g': { name: 'Grama (g)', toBase: 0.001 },
            'mg': { name: 'Miligrama (mg)', toBase: 0.000001 },
            't': { name: 'Tonelada (t)', toBase: 1000 },
            'lb': { name: 'Libra (lb)', toBase: 0.453592 },
            'oz': { name: 'Onça (oz)', toBase: 0.0283495 }
        }
    },
    temperature: {
        name: 'Temperatura',
        units: {
            'c': { name: 'Celsius (°C)', toBase: null },
            'f': { name: 'Fahrenheit (°F)', toBase: null },
            'k': { name: 'Kelvin (K)', toBase: null }
        },
        // Temperature requires special conversion
        convert: function(value, from, to) {
            // Convert to Celsius first
            let celsius;
            switch(from) {
                case 'c':
                    celsius = value;
                    break;
                case 'f':
                    celsius = (value - 32) * 5/9;
                    break;
                case 'k':
                    celsius = value - 273.15;
                    break;
            }
            
            // Convert from Celsius to target
            switch(to) {
                case 'c':
                    return celsius;
                case 'f':
                    return (celsius * 9/5) + 32;
                case 'k':
                    return celsius + 273.15;
            }
        }
    },
    volume: {
        name: 'Volume',
        units: {
            'l': { name: 'Litro (L)', toBase: 1 },
            'ml': { name: 'Mililitro (mL)', toBase: 0.001 },
            'm3': { name: 'Metro Cúbico (m³)', toBase: 1000 },
            'cm3': { name: 'Centímetro Cúbico (cm³)', toBase: 0.001 },
            'gal': { name: 'Galão (gal)', toBase: 3.78541 },
            'qt': { name: 'Quarto (qt)', toBase: 0.946353 },
            'pt': { name: 'Pint (pt)', toBase: 0.473176 },
            'cup': { name: 'Xícara (cup)', toBase: 0.236588 }
        }
    },
    area: {
        name: 'Área',
        units: {
            'm2': { name: 'Metro Quadrado (m²)', toBase: 1 },
            'km2': { name: 'Quilômetro Quadrado (km²)', toBase: 1000000 },
            'cm2': { name: 'Centímetro Quadrado (cm²)', toBase: 0.0001 },
            'ha': { name: 'Hectare (ha)', toBase: 10000 },
            'acre': { name: 'Acre', toBase: 4046.86 },
            'ft2': { name: 'Pé Quadrado (ft²)', toBase: 0.092903 }
        }
    }
};

// DOM elements
const categorySelect = document.getElementById('category');
const valueInput = document.getElementById('value');
const fromUnitSelect = document.getElementById('fromUnit');
const precisionSelect = document.getElementById('precision');
const convertBtn = document.getElementById('convertBtn');
const resultsTable = document.getElementById('resultsTable');

// Initialize the application
function init() {
    // Populate initial units based on default category
    updateUnitOptions();
    
    // Add event listeners
    categorySelect.addEventListener('change', updateUnitOptions);
    convertBtn.addEventListener('click', performConversion);
    
    // Allow Enter key to trigger conversion
    valueInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performConversion();
        }
    });
    
    // Show initial message
    showInfoMessage('Selecione uma categoria, insira um valor e clique em Converter');
}

// Update unit options when category changes
function updateUnitOptions() {
    const category = categorySelect.value;
    const units = unitCategories[category].units;
    
    fromUnitSelect.innerHTML = '';
    
    for (const [key, unit] of Object.entries(units)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = unit.name;
        fromUnitSelect.appendChild(option);
    }
    
    // Clear results when category changes
    showInfoMessage('Categoria alterada. Insira um valor e clique em Converter');
}

// Perform the conversion
function performConversion() {
    const value = parseFloat(valueInput.value);
    const category = categorySelect.value;
    const fromUnit = fromUnitSelect.value;
    const precision = parseInt(precisionSelect.value);
    
    // Validation
    if (isNaN(value)) {
        showError('Por favor, insira um valor numérico válido');
        return;
    }
    
    // Get category data
    const categoryData = unitCategories[category];
    const units = categoryData.units;
    
    // Build results array
    const results = [];
    
    for (const [key, unit] of Object.entries(units)) {
        let convertedValue;
        
        if (categoryData.convert) {
            // Special conversion (e.g., temperature)
            convertedValue = categoryData.convert(value, fromUnit, key);
        } else {
            // Standard conversion using base unit
            const baseValue = value * units[fromUnit].toBase;
            convertedValue = baseValue / units[key].toBase;
        }
        
        results.push({
            unit: unit.name,
            value: convertedValue,
            isSource: key === fromUnit
        });
    }
    
    // Display results
    displayResults(results, precision, value, units[fromUnit].name);
}

// Display results in a table
function displayResults(results, precision, originalValue, originalUnit) {
    let html = '<table>';
    html += '<thead><tr><th>Unidade</th><th>Valor</th></tr></thead>';
    html += '<tbody>';
    
    results.forEach(result => {
        const formattedValue = result.value.toFixed(precision);
        const rowClass = result.isSource ? ' style="background: #e8f4f8;"' : '';
        const marker = result.isSource ? ' ← (valor original)' : '';
        
        html += `<tr${rowClass}>`;
        html += `<td>${result.unit}${marker}</td>`;
        html += `<td>${formattedValue}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    
    resultsTable.innerHTML = html;
}

// Show error message
function showError(message) {
    resultsTable.innerHTML = `<div class="error-message">${message}</div>`;
}

// Show info message
function showInfoMessage(message) {
    resultsTable.innerHTML = `<div class="info-message">${message}</div>`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
