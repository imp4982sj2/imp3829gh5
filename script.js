window.addEventListener('DOMContentLoaded', (event) => {
    const div = document.getElementById('myDiv');
    const downloadBtn = document.getElementById('downloadBtn');
    const tableBody = document.querySelector('#myTable tbody');
    const exRateField = document.getElementById('exRate');
  
    downloadBtn.addEventListener('click', () => {
      html2canvas(div, { backgroundColor: null }).then((canvas) => {
        const image = canvas.toDataURL(); // Convert canvas to base64 image data
        const link = document.createElement('a');
        link.href = image;
        link.download = 'purchase_receipt.png';
        link.click();
      });
    });
  
    function addRow() {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td contenteditable="true">#xxxxxx</td>
        <td contenteditable="true">--,---,---.---  TL</td>
        <td>--,---,---.---  Rial</td>
      `;
      tableBody.appendChild(newRow);
  
      const codeCell = newRow.querySelector('td:first-child');
      const priceCell = newRow.querySelector('td:nth-child(2)');
      const resultCell = newRow.querySelector('td:nth-child(3)');
      const placeholder = '#xxxxxx';
      const invalidPrice = '--,---,---.---  TL';
      const invalidRate = '-,---.---';
  
      const formatPrice = (value) => {
        const parts = value.split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const decimalPart = parts[1] || '00';
        return integerPart + '.' + decimalPart;
      };
  
      const codeOnBlur = () => {
        let codeValue = codeCell.textContent.trim().startsWith('#') ? codeCell.textContent.trim().slice(1) : codeCell.textContent.trim();
      
        if (codeValue.length === 6 && /^[0-9a-fA-F]+$/.test(codeValue)) {
          codeCell.textContent = '#' + codeValue.toUpperCase();
        } else {
          codeCell.textContent = placeholder;
        }
      };
      
      const priceOnBlur = () => {
        let priceValue = priceCell.textContent.trim().replace(/,/g, '');
      
        if (/^[0-9]+(\.[0-9]*)?$/.test(priceValue)) {
          const formattedPrice = formatPrice(priceValue);
          priceCell.textContent = formattedPrice;
      
          const result = parseFloat(priceValue) * 2;
          const formattedResult = formatPrice(result.toFixed(3));
          resultCell.textContent = formattedResult + ' Rial';
        } else {
          priceCell.textContent = invalidPrice;
          resultCell.textContent = '--,---,---.--- Rial';
        }
      };
      
      const exRateOnBlur = () => {
        let exRateValue = exRateField.value.trim().replace(/,/g, '');
      
        if (/^[0-9]+(\.[0-9]*)?$/.test(exRateValue)) {
          const formattedExRate = formatPrice(exRateValue);
          exRateField.value = formattedExRate;
        } else {
          exRateField.value = invalidRate;
        }
      };
      
      codeCell.addEventListener('blur', codeOnBlur);
      priceCell.addEventListener('blur', priceOnBlur);
      exRateField.addEventListener('blur', exRateOnBlur);
      
  
      codeCell.addEventListener('focus', () => {
        if (codeCell.textContent.trim() === placeholder) {
          codeCell.textContent = '';
        }
      });
  
      priceCell.addEventListener('focus', () => {
        if (priceCell.textContent.trim() === invalidPrice) {
          priceCell.textContent = '';
        }
      });
  
      exRateField.addEventListener('focus', () => {
        if (exRateField.value.trim() === invalidRate) {
          exRateField.value = '';
        }
      });
    }
  
    const addRowButton = document.getElementById('addRowButton');
    addRowButton.addEventListener('click', addRow);
  
    addRow();
  });
  