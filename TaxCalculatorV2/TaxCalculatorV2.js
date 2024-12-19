document
  .getElementById("calculateButton")
  .addEventListener("click", handleCalculate);
const resultsSection = document.getElementById("resultsSection");
const calculateButton = document.getElementById("calculateButton");
const revenueInput = document.getElementById("revenue");
const costsInput = document.getElementById("costs");
const ipBoxCoeffInput = document.getElementById("ipBoxCoeff");
const ipBoxEdit = document.getElementById("ipBoxEdit");

// Add these functions at the top of the file
function formatPLN(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parsePLN(value) {
  return parseFloat(value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
}

function validateInput(value, fieldName) {
  const input = document.getElementById(fieldName);
  const errorElement = document.getElementById(`${fieldName}-error`);
  let isValid = true;

  // Clear previous error state
  input.classList.remove("error");
  errorElement.textContent = "";

  // Remove currency symbol and spaces for validation
  const numericValue = parsePLN(value);

  if (isNaN(numericValue)) {
    errorElement.textContent = "Proszę wprowadzić prawidłową kwotę";
    isValid = false;
  } else if (numericValue < 0) {
    errorElement.textContent = "Kwota nie może być ujemna";
    isValid = false;
  } else if (numericValue > 999999999) {
    errorElement.textContent = "Kwota jest zbyt duża";
    isValid = false;
  }

  if (!isValid) {
    input.classList.add("error");
  }

  return isValid;
}

function validateIpBoxCoeff(value) {
  const errorElement = document.getElementById("ipBoxCoeff-error");
  const numValue = parseFloat(value);
  let isValid = true;

  ipBoxCoeffInput.classList.remove("error");
  errorElement.textContent = "";

  if (isNaN(numValue) || value === "") {
    errorElement.textContent = "Proszę wprowadzić wartość";
    isValid = false;
  } else if (numValue < 0 || numValue > 100) {
    errorElement.textContent = "Wartość musi być między 0 a 100";
    isValid = false;
  }

  if (!isValid) {
    ipBoxCoeffInput.classList.add("error");
  }

  return isValid;
}

// Add these variables at the top of the file after your other const declarations
let previousIncome = null;
let initialIncome = null;

// Add these variables at the top with your other declarations
let initialRevenue = null;
let initialCosts = null;

// Add these variables at the top with your other declarations
let initialC6 = null;
let initialF6 = null;
let initialD6 = null;
let initialH6 = null;

// Add these to your initial variables section
let initialE6 = null;
let initialG6 = null;

// Add these to your initial variables section
let initialC9 = null;
let initialD9 = null;
let initialE9 = null;
let initialF9 = null;
let initialG9 = null;
let initialC11 = null;
let initialD11 = null;
let initialE11 = null;
let initialF11 = null;
let initialG11 = null;

// Add this after your other initial declarations
const ryczaltCheckboxes = document.querySelectorAll(
  '.checkbox-group input[type="checkbox"]'
);

// Add after other initial declarations
const ryczaltMessage = document.getElementById("ryczalt-message");

// Modify input listeners
revenueInput.addEventListener("input", (e) => {
  const isValid = validateInput(e.target.value, "revenue");
  if (!resultsSection.classList.contains("hidden") && isValid) {
    calculate();
  }
});

revenueInput.addEventListener("blur", (e) => {
  e.target.value = formatPLN(parsePLN(e.target.value));
});

costsInput.addEventListener("input", (e) => {
  const isValid = validateInput(e.target.value, "costs");
  if (!resultsSection.classList.contains("hidden") && isValid) {
    calculate();
  }
});

costsInput.addEventListener("blur", (e) => {
  e.target.value = formatPLN(parsePLN(e.target.value));
});

ipBoxCoeffInput.addEventListener("input", (e) => {
  if (
    !e.target.hasAttribute("readonly") &&
    validateIpBoxCoeff(e.target.value) &&
    !resultsSection.classList.contains("hidden")
  ) {
    calculate();
  }
});

// Add this function after the existing event listeners
function makeIpBoxReadonly() {
  if (!ipBoxCoeffInput.hasAttribute("readonly")) {
    ipBoxCoeffInput.setAttribute("readonly", "");
    ipBoxCoeffInput.classList.remove("editable");
    ipBoxEdit.textContent = "✎";
    if (validateIpBoxCoeff(ipBoxCoeffInput.value)) {
      calculate();
    }
  }
}

// Replace the existing ipBoxEdit click handler with this one
ipBoxEdit.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent the document click handler from firing
  const isEditable = ipBoxCoeffInput.hasAttribute("readonly");
  if (isEditable) {
    ipBoxCoeffInput.removeAttribute("readonly");
    ipBoxCoeffInput.classList.add("editable");
    ipBoxEdit.textContent = "✓";
    ipBoxCoeffInput.focus();
  } else {
    makeIpBoxReadonly();
  }
});

// Add click handler for the document
document.addEventListener("click", (e) => {
  if (!ipBoxCoeffInput.contains(e.target) && !ipBoxEdit.contains(e.target)) {
    makeIpBoxReadonly();
  }
});

// Add this to prevent the document click handler when clicking the input
ipBoxCoeffInput.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Modify the handleCalculate function to initialize previousIncome
function handleCalculate() {
  const isRevenueValid = validateInput(revenueInput.value, "revenue");
  const isCostsValid = validateInput(costsInput.value, "costs");
  const isIpBoxValid = validateIpBoxCoeff(ipBoxCoeffInput.value);

  if (isRevenueValid && isCostsValid && isIpBoxValid) {
    initialRevenue = parsePLN(revenueInput.value);
    initialCosts = parsePLN(costsInput.value);
    initialIncome = initialRevenue - initialCosts;

    // Display initial values
    document.getElementById(
      "revenue-initial"
    ).textContent = `Wartość początkowa: ${formatPLN(initialRevenue)}`;
    document.getElementById(
      "costs-initial"
    ).textContent = `Wartość początkowa: ${formatPLN(initialCosts)}`;

    calculate();
    // Store initial tax values after first calculation
    initialC6 = parsePLN(document.getElementById("C6").value);
    initialF6 = parsePLN(document.getElementById("F6").value);
    initialD6 = parsePLN(document.getElementById("D6").value);
    initialH6 = parsePLN(document.getElementById("H6").value);
    initialE6 = parsePLN(document.getElementById("E6").value);
    initialG6 = parsePLN(document.getElementById("G6").value);
    initialC9 = parsePLN(document.getElementById("C9").value);
    initialD9 = parsePLN(document.getElementById("D9").value);
    initialE9 = parsePLN(document.getElementById("E9").value);
    initialF9 = parsePLN(document.getElementById("F9").value);
    initialG9 = parsePLN(document.getElementById("G9").value);
    initialC11 = parsePLN(document.getElementById("C11").value);
    initialD11 = parsePLN(document.getElementById("D11").value);
    initialE11 = parsePLN(document.getElementById("E11").value);
    initialF11 = parsePLN(document.getElementById("F11").value);
    initialG11 = parsePLN(document.getElementById("G11").value);
    resultsSection.classList.remove("hidden");
    calculateButton.style.display = "none"; // Hide button after first click

    // Change scroll target to input-section
    document
      .querySelector(".input-section")
      .scrollIntoView({ behavior: "smooth" });

    // Show legal disclaimer
    document.getElementById("legalDisclaimer").classList.add("show");
  }

  // Initialize ryczałt visibility based on checked boxes
  ryczaltCheckboxes.forEach((checkbox) => {
    const targetId = checkbox.dataset.target;
    const targetInput = document.getElementById(targetId);
    const targetGroup = targetInput.closest(".input-group");

    if (checkbox.checked) {
      targetGroup.style.display = "flex";
    } else {
      targetGroup.style.display = "none";
    }
  });

  // Show message if no ryczałt options are selected initially
  const anyChecked = Array.from(ryczaltCheckboxes).some((cb) => cb.checked);
  ryczaltMessage.style.display = anyChecked ? "none" : "block";
}

// Update the calculate function by modifying the income calculation part
function calculate() {
  // Inputs
  let revenue = parsePLN(document.getElementById("revenue").value);
  let costs = parsePLN(document.getElementById("costs").value);
  let income = revenue - costs;

  // Set the main income value
  document.getElementById("income").value = formatPLN(income);

  // Handle the difference display
  if (initialIncome !== null) {
    let diff = income - initialIncome;
    // Find or create difference container
    let diffContainer = document.getElementById("income-diff-container");
    if (!diffContainer) {
      diffContainer = document.createElement("div");
      diffContainer.id = "income-diff-container";
      diffContainer.className = "income-diff";
      // Insert after income input
      document.getElementById("income").parentNode.appendChild(diffContainer);
    }

    // Only show difference if it's not zero
    if (diff !== 0) {
      diffContainer.textContent = `${diff > 0 ? "+" : ""}${formatPLN(diff)}`;
      diffContainer.style.display = "inline";
    } else {
      diffContainer.style.display = "none";
    }
  }

  previousIncome = income;

  let ipBoxCoeff =
    parseFloat(document.getElementById("ipBoxCoeff").value) / 100; // B11

  // Constants
  const healthContribLimit = 11600; // F16

  // Składka zdrowotna liniowy (C16)
  let tempC16 = (income / 12) * 0.09;
  let C16 = tempC16 <= 381.78 ? 381.78 * 12 : 0.049 * income;
  document.getElementById("C16").value = formatPLN(C16);

  // Składka zdrowotna ryczałt (C17)
  let C17;
  if (revenue > 300000) {
    C17 = 12 * 1258.39;
  } else if (revenue > 60000) {
    C17 = 12 * 699.11;
  } else {
    C17 = 12 * 419.46;
  }
  document.getElementById("C17").value = formatPLN(C17);

  // Składka zdrowotna skala podatkowa (C18)
  let tempC18 = (income / 12) * 0.09;
  let C18 = tempC18 <= 381.78 ? 381.78 * 12 : 0.09 * income;
  document.getElementById("C18").value = formatPLN(C18);

  // Efektywna składka zdrowotna do odliczenia na liniowym (F17)
  let F17 = Math.min(C16, healthContribLimit);
  document.getElementById("F17").value = formatPLN(F17);

  // Efektywna składka zdrowotna do odliczenia na ryczałcie (F18)
  let F18 = C17 * 0.5;
  document.getElementById("F18").value = formatPLN(F18);

  // J3 (Pole techniczne)
  let J3 = income * (1 - ipBoxCoeff);

  // Skala podatkowa (C6)
  let C6;
  if (income > 1000000) {
    C6 = 90000 * 0.12 + 880000 * 0.32 + (income - 1000000) * 0.36 + C18;
  } else if (income > 120000) {
    C6 = 90000 * 0.12 + (income - 120000) * 0.32 + C18;
  } else if (income > 30000) {
    C6 = (income - 30000) * 0.12 + C18;
  } else {
    C6 = C18;
  }
  document.getElementById("C6").value = formatPLN(C6);

  // Add difference display for C6
  if (initialC6 !== null) {
    let diffC6 = C6 - initialC6;
    let diffContainerC6 = document.getElementById("C6-diff");
    if (!diffContainerC6) {
      diffContainerC6 = document.createElement("div");
      diffContainerC6.id = "C6-diff";
      diffContainerC6.className = "income-diff";
      document.getElementById("C6").parentNode.appendChild(diffContainerC6);
    }
    if (diffC6 !== 0) {
      diffContainerC6.textContent = `${diffC6 > 0 ? "+" : ""}${formatPLN(
        diffC6
      )}`;
      diffContainerC6.style.display = "inline";
    } else {
      diffContainerC6.style.display = "none";
    }
  }

  // Skala podatkowa z małżonkiem bez dochodów (D6)
  let D6;
  if (income > 2000000) {
    D6 = 180000 * 0.12 + 1760000 * 0.32 + (income - 2000000) * 0.36 + C18;
  } else if (income > 240000) {
    D6 = 180000 * 0.12 + (income - 240000) * 0.32 + C18;
  } else if (income > 60000) {
    D6 = (income - 60000) * 0.12 + C18;
  } else {
    D6 = C18;
  }
  document.getElementById("D6").value = formatPLN(D6);

  // Add difference display for D6
  if (initialD6 !== null) {
    let diffD6 = D6 - initialD6;
    let diffContainerD6 = document.getElementById("D6-diff");
    if (!diffContainerD6) {
      diffContainerD6 = document.createElement("div");
      diffContainerD6.id = "D6-diff";
      diffContainerD6.className = "income-diff";
      document.getElementById("D6").parentNode.appendChild(diffContainerD6);
    }
    if (diffD6 !== 0) {
      diffContainerD6.textContent = `${diffD6 > 0 ? "+" : ""}${formatPLN(
        diffD6
      )}`;
      diffContainerD6.style.display = "inline";
    } else {
      diffContainerD6.style.display = "none";
    }
  }

  // Podatek liniowy (E6)
  let E6;
  if (income - F17 > 1000000) {
    E6 = (income - (F17 + 1000000)) * 0.23 + 0.19 * 1000000 + C16;
  } else {
    E6 = (income - F17) * 0.19 + C16;
  }
  document.getElementById("E6").value = formatPLN(E6);

  // Add difference display for E6
  if (initialE6 !== null) {
    let diffE6 = E6 - initialE6;
    let diffContainerE6 = document.getElementById("E6-diff");
    if (!diffContainerE6) {
      diffContainerE6 = document.createElement("div");
      diffContainerE6.id = "E6-diff";
      diffContainerE6.className = "income-diff";
      document.getElementById("E6").parentNode.appendChild(diffContainerE6);
    }
    // Only show difference if it's greater than 0.01 or less than -0.01
    if (Math.abs(diffE6) > 0.01) {
      diffContainerE6.textContent = `${diffE6 > 0 ? "+" : ""}${formatPLN(
        diffE6
      )}`;
      diffContainerE6.style.display = "inline";
    } else {
      diffContainerE6.style.display = "none";
    }
  }

  // IP BOX skala podatkowa (F6)
  let F6_part1 = income * ipBoxCoeff * 0.14;
  let F6_taxable = income * (1 - ipBoxCoeff);
  let F6_tax;
  if (F6_taxable > 1000000) {
    F6_tax =
      30000 * 0.09 +
      90000 * 0.26 +
      880000 * 0.41 +
      (F6_taxable - 1000000) * 0.45;
  } else if (F6_taxable > 120000) {
    F6_tax = 30000 * 0.09 + 90000 * 0.26 + (F6_taxable - 120000) * 0.41;
  } else if (F6_taxable > 30000) {
    F6_tax = 30000 * 0.09 + (F6_taxable - 30000) * 0.26;
  } else {
    F6_tax = F6_taxable * 0.09;
  }
  let F6 = F6_part1 + F6_tax;
  document.getElementById("F6").value = formatPLN(F6);

  // Add difference display for F6
  if (initialF6 !== null) {
    let diffF6 = F6 - initialF6;
    let diffContainerF6 = document.getElementById("F6-diff");
    if (!diffContainerF6) {
      diffContainerF6 = document.createElement("div");
      diffContainerF6.id = "F6-diff";
      diffContainerF6.className = "income-diff";
      document.getElementById("F6").parentNode.appendChild(diffContainerF6);
    }
    if (diffF6 !== 0) {
      diffContainerF6.textContent = `${diffF6 > 0 ? "+" : ""}${formatPLN(
        diffF6
      )}`;
      diffContainerF6.style.display = "inline";
    } else {
      diffContainerF6.style.display = "none";
    }
  }

  // IP BOX podatek liniowy (G6)
  let G6_part1 = income * ipBoxCoeff * 0.099;
  let G6_taxable = income * (1 - ipBoxCoeff) - F17;
  let G6_part2 = G6_taxable > 0 ? G6_taxable * 0.239 : 0;
  let G6 = G6_part1 + G6_part2;
  document.getElementById("G6").value = formatPLN(G6);

  // Add difference display for G6
  if (initialG6 !== null) {
    let diffG6 = G6 - initialG6;
    let diffContainerG6 = document.getElementById("G6-diff");
    if (!diffContainerG6) {
      diffContainerG6 = document.createElement("div");
      diffContainerG6.id = "G6-diff";
      diffContainerG6.className = "income-diff";
      document.getElementById("G6").parentNode.appendChild(diffContainerG6);
    }
    // Only show difference if it's greater than 0.01 or less than -0.01
    if (Math.abs(diffG6) > 0.01) {
      diffContainerG6.textContent = `${diffG6 > 0 ? "+" : ""}${formatPLN(
        diffG6
      )}`;
      diffContainerG6.style.display = "inline";
    } else {
      diffContainerG6.style.display = "none";
    }
  }

  // IP BOX skala z ma��żonkiem bez dochodów (H6)
  let H6_part1 = income * ipBoxCoeff * 0.14;
  let H6_taxable = income * (1 - ipBoxCoeff);
  let H6_tax;
  if (H6_taxable > 2000000) {
    H6_tax =
      60000 * 0.09 +
      180000 * 0.26 +
      1760000 * 0.41 +
      (H6_taxable - 2000000) * 0.45;
  } else if (H6_taxable > 240000) {
    H6_tax = 60000 * 0.09 + 180000 * 0.26 + (H6_taxable - 240000) * 0.41;
  } else if (H6_taxable > 60000) {
    H6_tax = 60000 * 0.09 + (H6_taxable - 60000) * 0.26;
  } else {
    H6_tax = H6_taxable * 0.09;
  }
  let H6 = H6_part1 + H6_tax;
  document.getElementById("H6").value = formatPLN(H6);

  // Add difference display for H6
  if (initialH6 !== null) {
    let diffH6 = H6 - initialH6;
    let diffContainerH6 = document.getElementById("H6-diff");
    if (!diffContainerH6) {
      diffContainerH6 = document.createElement("div");
      diffContainerH6.id = "H6-diff";
      diffContainerH6.className = "income-diff";
      document.getElementById("H6").parentNode.appendChild(diffContainerH6);
    }
    if (diffH6 !== 0) {
      diffContainerH6.textContent = `${diffH6 > 0 ? "+" : ""}${formatPLN(
        diffH6
      )}`;
      diffContainerH6.style.display = "inline";
    } else {
      diffContainerH6.style.display = "none";
    }
  }

  // Ryczałt 2% (C9)
  let C9 = (revenue - F18) * 0.02 + C17;
  document.getElementById("C9").value = formatPLN(C9);

  // Add difference display for C9
  if (initialC9 !== null) {
    let diffC9 = C9 - initialC9;
    let diffContainerC9 = document.getElementById("C9-diff");
    if (!diffContainerC9) {
      diffContainerC9 = document.createElement("div");
      diffContainerC9.id = "C9-diff";
      diffContainerC9.className = "income-diff";
      document.getElementById("C9").parentNode.appendChild(diffContainerC9);
    }
    if (Math.abs(diffC9) > 0.01) {
      diffContainerC9.textContent = `${diffC9 > 0 ? "+" : ""}${formatPLN(
        diffC9
      )}`;
      diffContainerC9.style.display = "inline";
    } else {
      diffContainerC9.style.display = "none";
    }
  }

  // Ryczałt 3% (D9)
  let D9 = (revenue - F18) * 0.03 + C17;
  document.getElementById("D9").value = formatPLN(D9);

  // Ryczałt 5,5% (E9)
  let E9 = (revenue - F18) * 0.055 + C17;
  document.getElementById("E9").value = formatPLN(E9);

  // Ryczałt 8,5% (F9)
  let F9 = (revenue - F18) * 0.085 + C17;
  document.getElementById("F9").value = formatPLN(F9);

  // Ryczałt 8,5% i 12,5% powyżej 100 000 zł (G9)
  let G9;
  if (revenue <= 100000) {
    G9 = (revenue - F18) * 0.085 + C17;
  } else {
    G9 = (revenue - (F18 + 100000)) * 0.125 + C17 + 8500;
  }
  document.getElementById("G9").value = formatPLN(G9);

  // Ryczałt 10% (C11)
  let C11 = (revenue - F18) * 0.1 + C17;
  document.getElementById("C11").value = formatPLN(C11);

  // Ryczałt 12% (D11)
  let D11 = (revenue - F18) * 0.12 + C17;
  document.getElementById("D11").value = formatPLN(D11);

  // Ryczałt 14% (E11)
  let E11 = (revenue - F18) * 0.14 + C17;
  document.getElementById("E11").value = formatPLN(E11);

  // Ryczałt 15% (F11)
  let F11 = (revenue - F18) * 0.15 + C17;
  document.getElementById("F11").value = formatPLN(F11);

  // Ryczałt 17% (G11)
  let G11 = (revenue - F18) * 0.17 + C17;
  document.getElementById("G11").value = formatPLN(G11);

  // Repeat the same pattern for other ryczałt fields
  const ryczaltFields = [
    { id: "D9", value: D9, initial: initialD9 },
    { id: "E9", value: E9, initial: initialE9 },
    { id: "F9", value: F9, initial: initialF9 },
    { id: "G9", value: G9, initial: initialG9 },
    { id: "C11", value: C11, initial: initialC11 },
    { id: "D11", value: D11, initial: initialD11 },
    { id: "E11", value: E11, initial: initialE11 },
    { id: "F11", value: F11, initial: initialF11 },
    { id: "G11", value: G11, initial: initialG11 },
  ];

  ryczaltFields.forEach((field) => {
    if (field.initial !== null) {
      let diff = field.value - field.initial;
      let diffContainer = document.getElementById(`${field.id}-diff`);
      if (!diffContainer) {
        diffContainer = document.createElement("div");
        diffContainer.id = `${field.id}-diff`;
        diffContainer.className = "income-diff";
        document.getElementById(field.id).parentNode.appendChild(diffContainer);
      }
      if (Math.abs(diff) > 0.01) {
        diffContainer.textContent = `${diff > 0 ? "+" : ""}${formatPLN(diff)}`;
        diffContainer.style.display = "inline";
      } else {
        diffContainer.style.display = "none";
      }
    }
  });

  // Only update visible ryczałt inputs
  ryczaltCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const targetId = checkbox.dataset.target;
      const targetInput = document.getElementById(targetId);
      // Make sure the input value is updated only if it's visible
      if (targetInput.closest(".input-group").style.display !== "none") {
      }
    }
  });
}

// Add this to your window.onload or at the bottom of your file
ryczaltCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const targetId = this.dataset.target;
    const targetInput = document.getElementById(targetId);
    const targetGroup = targetInput.closest(".input-group");

    if (this.checked) {
      targetGroup.style.display = "flex";
    } else {
      targetGroup.style.display = "none";
    }

    // Check if any checkbox is checked
    const anyChecked = Array.from(ryczaltCheckboxes).some((cb) => cb.checked);
    ryczaltMessage.style.display = anyChecked ? "none" : "block";
  });
});
