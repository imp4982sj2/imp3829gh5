window.addEventListener('DOMContentLoaded', (event) => {
  const div = document.getElementById('container');
  const downloadBtn = document.getElementById('downloadButton');
  const tableBody = document.querySelector('#table tbody');
  const table = document.getElementById('table');

  const exchangeRateField = document.getElementById('exchangeRate');
  const exchangeRateWithCommisionField = document.getElementById('exchangeRateWithCommision');
  const exchangeRateWithCommisionCalculationsField = document.getElementById('exchangeRateWithCommisionCalculations')
  const exchangeRateWithCommisionContainer = document.getElementById('exchangeRateWithCommisionContainer');
  const deliveryFeeField = document.getElementById('deliveryFee');
  const purchaseCodeField = document.getElementById('purchaseCode')

  let resultCells = document.querySelectorAll('#table td:nth-child(3)');
  console.log(resultCells);
  const totalValueField = document.getElementById('totalValue');


  downloadBtn.addEventListener('click', () => {
    html2canvas(div, { backgroundColor: null }).then((canvas) => {
      const image = canvas.toDataURL(); // Convert canvas to base64 image data
      const link = document.createElement('a');
      link.href = image;
      let receiptFilename = "purchase_receipt.png"
      if (purchaseCodeField.innerText.trim() != "#XXXXXX"){
        receiptFilename = `${purchaseCodeField.innerText.trim()}.png`
      }
      link.download = receiptFilename;
      link.click();
    });
  });

  function addRow() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td contenteditable="true" >#XXXXXX</td>
      <td contenteditable="true" >--,---,---.--  TL</td>
      <td contenteditable="true">--,---,---.--  Rial</td>
    `;
    tableBody.appendChild(newRow);

    const codeCell = newRow.querySelector('td:first-child');
    const priceCell = newRow.querySelector('td:nth-child(2)');
    const resultCell = newRow.querySelector('td:nth-child(3)');
    const placeholder = '#XXXXXX';
    const invalidPrice = '--,---,---.--  TL';
    const invalidRate = '-,---.--';

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
      let priceValue = priceCell.textContent.trim().replace(/,/g, '').replace(/\s+(TL|Rial)$/, '');
      let exRateWithCommissionValue = exchangeRateWithCommisionField.textContent.trim().replace(/,/g, '');

      if (/^[0-9]+(\.[0-9]*)?$/.test(priceValue)) {
        const formattedPrice = formatPrice(priceValue);
        priceCell.textContent = formattedPrice + ' TL';

        const result = parseFloat(priceValue) *  parseFloat(exRateWithCommissionValue);
        const formattedResult = formatPrice(result.toFixed(2));
        resultCell.textContent = formattedResult + ' Rial';
      } else {
        priceCell.textContent = invalidPrice;
        resultCell.textContent = '--,---,---.-- Rial';
      }

      resultCells = document.querySelectorAll('#table td:nth-child(3)');

    };

    const exRateOnBlur = () => {
      let exRateValue = exchangeRateField.textContent.trim().replace(/,/g, '');

      if (/^[0-9]+(\.[0-9]*)?$/.test(exRateValue)) {
        const formattedExRate = formatPrice(exRateValue);
        exchangeRateField.textContent = formattedExRate;
        calculateExchangeRateWithCommision();       

      } else {
        exchangeRateField.textContent = invalidRate;
      }
    };

    const deliveryFeeOnBlur = () => {
      let deliveryFeeValue = deliveryFeeField.textContent.trim().replace(/,/g, '');
      if (/^[0-9]+(\.[0-9]*)?$/.test(deliveryFeeValue)) {
        const formattedDeliveryFee = formatPrice(deliveryFeeValue);
        deliveryFeeField.textContent = formattedDeliveryFee;

      } else {
        deliveryFeeField.textContent = "00.00";
      }
    };
    
    const purchaseCodeOnBlur = () => {
      let purchaseCodeValue = purchaseCodeField.textContent.trim().startsWith('#') ? purchaseCodeField.textContent.trim().slice(1) : purchaseCodeField.textContent.trim();

      if (purchaseCodeValue.length === 6 && /^[0-9a-fA-F]+$/.test(purchaseCodeValue)) {
        purchaseCodeField.textContent = '#' + purchaseCodeValue.toUpperCase();
      } else {
        purchaseCodeField.textContent = placeholder;
      }
    };

    function calculateExchangeRateWithCommision() {
      const exchangeRateValue = parseFloat(exchangeRateField.textContent.trim().replace(/,/g, ''));
      if (isNaN(exchangeRateValue)) {
        exchangeRateWithCommisionField.textContent = '-,---.--';
        exchangeRateWithCommisionContainer.style.opacity = '0';
        exchangeRateWithCommisionContainer.style.visibility = 'hidden';
        return;
      }
      const commisionPercent = 15;
      const exchangeRateWithCommisionValue = exchangeRateValue + (exchangeRateValue * commisionPercent / 100);
      const formattedExchangeRate = formatPrice(exchangeRateValue.toFixed(2));
      const formattedExchangeRateWithCommision = formatPrice(exchangeRateWithCommisionValue.toFixed(2));

      let priceValue = priceCell.textContent.trim().replace(/,/g, '').replace(/\s+(TL|Rial)$/, '');
      const result = parseFloat(priceValue) * parseFloat(formattedExchangeRateWithCommision) ;
      const formattedResult = formatPrice(result.toFixed(2));
      resultCell.textContent = formattedResult + ' Rial';
  
      exchangeRateField.textContent = formattedExchangeRate;
      exchangeRateWithCommisionField.textContent = formattedExchangeRateWithCommision;
      exchangeRateWithCommisionCalculationsField.textContent = exchangeRateField.textContent.trim().replace(/,/g, '') + ` + ${commisionPercent}% = `;

      exchangeRateWithCommisionContainer.style.opacity = '1';
      exchangeRateWithCommisionContainer.style.visibility = 'visible';
    };

    function calculateTotalValue() {
      let total = 0;
      resultCells.forEach((cell) => {
        const value = parseFloat(cell.innerText.trim().replace(/[^0-9.-]+/g, "").replace(/\s+(TL|Rial)$/, ""));
        // console.log(value);
        if (!isNaN(value)) {
          total += value;
        } else {
          total -= 10;
        }
      });

      // for(var i = 1; i < table.rows.length; i++)
      // {
      //   total += parseFloat(table.rows[i].cells[2].innerHTML.replace(/[^0-9.-]+/g, "").replace(/\s+(TL|Rial)$/, ""))
      // }
  
      const deliveryFeeValue = parseFloat(deliveryFeeField.textContent.trim().replace(/[^0-9.-]+/g,""));
      if (!isNaN(deliveryFeeValue)) {
        total += deliveryFeeValue;
      }
  
      totalValueField.textContent = formatPrice(total.toFixed(2)) + "\xa0\xa0\xa0\xa0\xa0Rial";
    };

    codeCell.addEventListener('blur', codeOnBlur);
    priceCell.addEventListener('blur', priceOnBlur);
    exchangeRateField.addEventListener('blur', exRateOnBlur);
    exchangeRateField.addEventListener('blur', calculateExchangeRateWithCommision);
    deliveryFeeField.addEventListener('blur', deliveryFeeOnBlur);
    purchaseCodeField.addEventListener('blur', purchaseCodeOnBlur);
    exchangeRateField.addEventListener('blur', calculateTotalValue);
    priceCell.addEventListener('blur', calculateTotalValue);
    deliveryFeeField.addEventListener('blur', calculateTotalValue);



    for(var i = 1; i < table.rows.length; i++){
      table.rows[i].cells[2].addEventListener('mousedown', (event) => {
        event.preventDefault();})
    }

    codeCell.addEventListener('click', () => {
      if (codeCell.textContent.trim() === placeholder) {
        codeCell.textContent = '';
      }
    });

    priceCell.addEventListener('click', () => {
      if (priceCell.textContent.trim() === invalidPrice) {
        priceCell.textContent = '';
      }
    });

    exchangeRateField.addEventListener('click', () => {
      if (exchangeRateField.textContent.trim() === invalidRate) {
        exchangeRateField.textContent = '';
      }
    });

    deliveryFeeField.addEventListener('click', () => {
      if (deliveryFeeField.textContent.trim() === "00.00") {
        deliveryFeeField.textContent = '';
      }
    });

    purchaseCodeField.addEventListener('click', () => {
      if (purchaseCodeField.textContent.trim() === placeholder) {
        purchaseCodeField.textContent = '';
      }
    });
  }

  const addRowButton = document.getElementById('addRowButton');
  addRowButton.addEventListener('click', addRow);

  setTimeout(() => {
    addRow();
  }, 500);
});
