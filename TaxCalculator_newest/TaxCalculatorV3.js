document
  .getElementById("calculateButton")
  .addEventListener("click", handleCalculate);
const resultsSection = document.getElementById("resultsSection");
const calculateButton = document.getElementById("calculateButton");
const revenueInput = document.getElementById("revenue");
const costsInput = document.getElementById("costs");
const ipBoxCoeffInput = document.getElementById("ipBoxCoeff");
const ipBoxEdit = document.getElementById("ipBoxEdit");
const ipBoxContainer = document.getElementById("ipBoxContainer");

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
  if (errorElement) {
    // Only proceed if errorElement exists
    errorElement.textContent = "";
    errorElement.classList.remove("visible");
  }

  // Remove currency symbol and spaces for validation
  const numericValue = parsePLN(value);

  if (isNaN(numericValue)) {
    if (errorElement) {
      errorElement.textContent = "Proszę wprowadzić prawidłową kwotę";
    }
    isValid = false;
  } else if (numericValue < 0) {
    if (errorElement) {
      errorElement.textContent = "Kwota nie może być ujemna";
    }
    isValid = false;
  } else if (numericValue > 999999999) {
    if (errorElement) {
      errorElement.textContent = "Kwota jest zbyt duża";
    }
    isValid = false;
  }

  if (!isValid) {
    input.classList.add("error");
    if (errorElement) {
      errorElement.classList.add("visible");
    }
  }

  return isValid;
}

function validateIpBoxCoeff(value) {
  const errorElement = document.getElementById("ipBoxCoeff-error");
  const numValue = parseFloat(value);
  let isValid = true;

  ipBoxCoeffInput.classList.remove("error");
  errorElement.textContent = "";
  errorElement.classList.remove("visible");

  if (isNaN(numValue) || value === "") {
    errorElement.textContent = "Proszę wprowadzić wartość";
    isValid = false;
  } else if (numValue < 0 || numValue > 100) {
    errorElement.textContent = "Wartość musi być między 0 a 100";
    isValid = false;
  }

  if (!isValid) {
    ipBoxCoeffInput.classList.add("error");
    errorElement.classList.add("visible");
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

// Add these to your initial variables section
let initialC6_joint = null;
let initialF6_joint = null;

// Add this after your other initial declarations
const ryczaltCheckboxes = document.querySelectorAll(
  '.checkbox-group input[type="checkbox"]'
);

// Add after other initial declarations
const ryczaltMessage = document.getElementById("ryczalt-message");

// Add after other initial declarations
const jointTaxationRadios = document.querySelectorAll(
  'input[name="jointTaxation"]'
);
const spouseIncomeCard = document.getElementById("spouseIncomeCard");
const spouseIncomeInput = document.getElementById("spouseIncome");

// Add these functions after your existing variable declarations and before the calculate function
function calculateSpouseFreeQuota0(spouseIncome) {
  // J11
  return spouseIncome <= 30000 ? 30000 - spouseIncome : 0;
}

function calculateSpouseFreeQuota12(spouseIncome) {
  // K11
  if (spouseIncome <= 120000) {
    if (spouseIncome <= 30000) {
      return 90000;
    }
    return 90000 - (spouseIncome - 30000);
  }
  return 0;
}

function calculateSpouseFreeQuota32(spouseIncome) {
  // L11
  if (spouseIncome <= 1000000) {
    if (spouseIncome <= 120000) {
      return 880000;
    }
    return 880000 - (spouseIncome - 120000);
  }
  return 0;
}

function calculateTaxWithSpouse(income, jointTaxation, spouseIncome, C18) {
  if (!jointTaxation) {
    return (
      Math.min(income, 30000) * 0 +
      Math.min(Math.max(income - 30000, 0), 90000) * 0.12 +
      Math.min(Math.max(income - 120000, 0), 880000) * 0.32 +
      Math.max(income - 1000000, 0) * 0.36 +
      C18
    );
  }

  const J11 = calculateSpouseFreeQuota0(spouseIncome);
  const K11 = calculateSpouseFreeQuota12(spouseIncome);
  const L11 = calculateSpouseFreeQuota32(spouseIncome);

  return (
    Math.min(income, 30000 + J11) * 0 +
    Math.min(Math.max(income - (30000 + J11), 0), 90000 + K11) * 0.12 +
    Math.min(
      Math.max(income - (30000 + J11) - (90000 + K11), 0),
      880000 + L11
    ) *
      0.32 +
    Math.max(income - (30000 + J11) - (90000 + K11) - (880000 + L11), 0) *
      0.36 +
    C18
  );
}

// Modify input listeners
revenueInput.addEventListener("input", (e) => {
  const isValid = validateInput(e.target.value, "revenue");
  if (!resultsSection.classList.contains("hidden") && isValid) {
    calculate();
  }
  if (multipleRatesToggle.checked) {
    updateRemainingRevenue();
  }
});

revenueInput.addEventListener("blur", (e) => {
  e.target.value = formatPLN(parsePLN(e.target.value));
  if (multipleRatesToggle.checked) {
    updateRemainingRevenue();
  }
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

// ----------------------------------------------------------------------------------------------

// Function to revert input to read-only
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

// Click handler for the edit button
ipBoxEdit.addEventListener("click", (e) => {
  e.stopPropagation();
  const isCurrentlyReadOnly = ipBoxCoeffInput.hasAttribute("readonly");

  if (isCurrentlyReadOnly) {
    ipBoxCoeffInput.removeAttribute("readonly");
    ipBoxCoeffInput.classList.add("editable");
    ipBoxEdit.textContent = "✓";
    ipBoxCoeffInput.focus();
  } else {
    makeIpBoxReadonly();
  }
});

// Click handler for the input field itself
ipBoxCoeffInput.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Document click handler - checks if click is outside container
document.addEventListener("click", (e) => {
  if (!ipBoxContainer.contains(e.target)) {
    makeIpBoxReadonly();
  }
});

// -------------------------------------------------------------------------------------------------

// Modify the joint taxation radio event listener
jointTaxationRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    spouseIncomeCard.classList.remove("shake"); // Remove any existing shake animation
    const jointTaxationCards = document.querySelectorAll(
      ".joint-taxation-card"
    );
    if (e.target.value === "yes") {
      spouseIncomeCard.classList.remove("inactive");
      spouseIncomeInput.removeAttribute("readonly");
      spouseIncomeInput.value = ""; // Clear the value first
      spouseIncomeInput.placeholder = "wartość..."; // Set placeholder
      spouseIncomeCard.classList.add("shake");
      jointTaxationCards.forEach((card) => card.classList.add("show"));
      setTimeout(() => {
        spouseIncomeCard.classList.remove("shake");
      }, 500);
      if (!resultsSection.classList.contains("hidden")) {
        calculate();
        initialC6_joint = parsePLN(document.getElementById("C6_joint").value);
        initialF6_joint = parsePLN(document.getElementById("F6_joint").value);
      }
    } else {
      spouseIncomeCard.classList.add("inactive");
      spouseIncomeInput.setAttribute("readonly", "");
      spouseIncomeInput.value = formatPLN(0);
      spouseIncomeInput.placeholder = ""; // Clear placeholder
      jointTaxationCards.forEach((card) => card.classList.remove("show"));
      // Reset initial values when disabling joint taxation
      initialC6_joint = null;
      initialF6_joint = null;
      if (!resultsSection.classList.contains("hidden")) {
        calculate();
      }
    }
  });
});

// Add these event listeners for spouse income input
spouseIncomeInput.addEventListener("input", (e) => {
  if (!spouseIncomeCard.classList.contains("inactive")) {
    const isValid = validateInput(e.target.value, "spouseIncome");
    if (!resultsSection.classList.contains("hidden") && isValid) {
      calculate();
    }
  }
});

spouseIncomeInput.addEventListener("blur", (e) => {
  if (!spouseIncomeCard.classList.contains("inactive")) {
    e.target.value = formatPLN(parsePLN(e.target.value));
  }
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
    initialC6_joint = parsePLN(document.getElementById("C6_joint").value);
    initialF6_joint = parsePLN(document.getElementById("F6_joint").value);
    // Only initialize joint taxation values if joint taxation is selected
    if (
      document.querySelector('input[name="jointTaxation"]:checked').value ===
      "yes"
    ) {
      calculate(); // Calculate again to get proper joint taxation values
      initialC6_joint = parsePLN(document.getElementById("C6_joint").value);
      initialF6_joint = parsePLN(document.getElementById("F6_joint").value);
    } else {
      initialC6_joint = null;
      initialF6_joint = null;
    }
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

  // Initialize spouse income card state
  const jointTaxationSelected = document.querySelector(
    'input[name="jointTaxation"]:checked'
  ).value;
  if (jointTaxationSelected === "no") {
    spouseIncomeCard.classList.add("inactive");
    spouseIncomeInput.setAttribute("readonly", "");
    spouseIncomeInput.value = formatPLN(0);
  }
}

function calculate() {
  // Inputs
  let revenue = parsePLN(document.getElementById("revenue").value);
  let costs = parsePLN(document.getElementById("costs").value);
  let income = revenue - costs;

  // === NEW CODE FOR MULTIPLE RATES STARTS HERE ===
  let allocatedRevenues = {};
  if (multipleRatesToggle.checked) {
    const totalRevenue = parsePLN(document.getElementById("revenue").value);
    let usedRevenue = 0;
    const rateInputsVisible = document.querySelectorAll(".rate-input.show");
    rateInputsVisible.forEach((input) => {
      const allocatedValue = parsePLN(input.value) || 0;
      usedRevenue += allocatedValue;
      allocatedRevenues[input.dataset.for] = allocatedValue;
    });

    // === VALIDATION REMOVED HERE ===
    // Previously, there was a check to see if allocated revenue exceeds total revenue.
    // This validation has been removed as per your request.
  }
  // === NEW CODE FOR MULTIPLE RATES ENDS HERE ===

  // Set the main income value
  document.getElementById("income").value = formatPLN(income);

  if (initialIncome !== null) {
    let diff = income - initialIncome;
    let diffContainer = document.getElementById("income-diff-container");
    if (!diffContainer) {
      diffContainer = document.createElement("div");
      diffContainer.id = "income-diff-container";
      diffContainer.className = "income-diff";
      document.getElementById("income").parentNode.appendChild(diffContainer);
    }

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

  // J3 (2 część dochodu do opodatkowania - IP BOX)
  let J3 = income * (1 - ipBoxCoeff);

  function calculateSpouseFreeQuota0(spouseIncome) {
    return spouseIncome <= 30000 ? 30000 - spouseIncome : 0;
  }

  function calculateSpouseFreeQuota12(spouseIncome) {
    if (spouseIncome <= 120000) {
      if (spouseIncome <= 30000) {
        return 90000;
      }
      return 90000 - (spouseIncome - 30000);
    }
    return 0;
  }

  function calculateSpouseFreeQuota32(spouseIncome) {
    if (spouseIncome <= 1000000) {
      if (spouseIncome <= 120000) {
        return 880000;
      }
      return 880000 - (spouseIncome - 120000);
    }
    return 0;
  }

  function calculateTaxWithSpouse(income, jointTaxation, spouseIncome, C18) {
    if (!jointTaxation) {
      return (
        Math.min(income, 30000) * 0 +
        Math.min(Math.max(income - 30000, 0), 90000) * 0.12 +
        Math.min(Math.max(income - 120000, 0), 880000) * 0.32 +
        Math.max(income - 1000000, 0) * 0.36 +
        C18
      );
    }

    const J11 = calculateSpouseFreeQuota0(spouseIncome);
    const K11 = calculateSpouseFreeQuota12(spouseIncome);
    const L11 = calculateSpouseFreeQuota32(spouseIncome);

    return (
      Math.min(income, 30000 + J11) * 0 +
      Math.min(Math.max(income - (30000 + J11), 0), 90000 + K11) * 0.12 +
      Math.min(
        Math.max(income - (30000 + J11) - (90000 + K11), 0),
        880000 + L11
      ) *
        0.32 +
      Math.max(income - (30000 + J11) - (90000 + K11) - (880000 + L11), 0) *
        0.36 +
      C18
    );
  }

  // Skala podatkowa (C6) - without joint taxation
  let C6 = calculateTaxWithSpouse(income, false, 0, C18);
  document.getElementById("C6").value = formatPLN(C6);

  // Skala podatkowa (C6_joint) - with joint taxation
  if (
    document.querySelector('input[name="jointTaxation"]:checked').value ===
    "yes"
  ) {
    let C6_joint = calculateTaxWithSpouse(
      income,
      true,
      parsePLN(document.getElementById("spouseIncome").value),
      C18
    );
    document.getElementById("C6_joint").value = formatPLN(C6_joint);

    if (initialC6_joint !== null) {
      let diffC6_joint = C6_joint - initialC6_joint;
      updateDifferenceDisplay("C6_joint", diffC6_joint);
    }
  }

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

  // Podatek liniowy (E6)
  let E6;
  if (income - F17 > 1000000) {
    E6 = (income - (F17 + 1000000)) * 0.23 + 0.19 * 1000000 + C16;
  } else {
    E6 = (income - F17) * 0.19 + C16;
  }
  document.getElementById("E6").value = formatPLN(E6);

  if (initialE6 !== null) {
    let diffE6 = E6 - initialE6;
    let diffContainerE6 = document.getElementById("E6-diff");
    if (!diffContainerE6) {
      diffContainerE6 = document.createElement("div");
      diffContainerE6.id = "E6-diff";
      diffContainerE6.className = "income-diff";
      document.getElementById("E6").parentNode.appendChild(diffContainerE6);
    }
    if (Math.abs(diffE6) > 0.01) {
      diffContainerE6.textContent = `${diffE6 > 0 ? "+" : ""}${formatPLN(
        diffE6
      )}`;
      diffContainerE6.style.display = "inline";
    } else {
      diffContainerE6.style.display = "none";
    }
  }

  // IP BOX skala podatkowa (F6) - without joint taxation
  let F6 =
    income * ipBoxCoeff * 0.05 +
    Math.min(J3, 30000) * 0 +
    Math.min(Math.max(J3 - 30000, 0), 90000) * 0.12 +
    Math.min(Math.max(J3 - 120000, 0), 880000) * 0.32 +
    Math.max(J3 - 1000000, 0) * 0.36 +
    C18;
  document.getElementById("F6").value = formatPLN(F6);

  if (
    document.querySelector('input[name="jointTaxation"]:checked').value ===
    "yes"
  ) {
    const spouseIncome = parsePLN(
      document.getElementById("spouseIncome").value
    );
    const J11 = calculateSpouseFreeQuota0(spouseIncome);
    const K11 = calculateSpouseFreeQuota12(spouseIncome);
    const L11 = calculateSpouseFreeQuota32(spouseIncome);

    let F6_joint =
      income * ipBoxCoeff * 0.05 +
      Math.min(J3, 30000 + J11) * 0 +
      Math.min(Math.max(J3 - (30000 + J11), 0), 90000 + K11) * 0.12 +
      Math.min(Math.max(J3 - (30000 + J11) - (90000 + K11), 0), 880000 + L11) *
        0.32 +
      Math.max(J3 - (30000 + J11) - (90000 + K11) - (880000 + L11), 0) * 0.36 +
      C18;
    document.getElementById("F6_joint").value = formatPLN(F6_joint);

    if (initialF6_joint !== null) {
      let diffF6_joint = F6_joint - initialF6_joint;
      updateDifferenceDisplay("F6_joint", diffF6_joint);
    }
  }

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

  // Podatek liniowy (IP BOX) (G6)
  let G6_part1 = income * ipBoxCoeff * 0.05;
  let taxableIncome = income * (1 - ipBoxCoeff) - F17;
  let G6_part2;
  if (taxableIncome > 1000000) {
    G6_part2 = (taxableIncome - 1000000) * 0.23 + 0.19 * 1000000;
  } else {
    G6_part2 = taxableIncome * 0.19;
  }
  let G6 = G6_part1 + G6_part2 + C16;
  document.getElementById("G6").value = formatPLN(G6);

  if (initialG6 !== null) {
    let diffG6 = G6 - initialG6;
    let diffContainerG6 = document.getElementById("G6-diff");
    if (!diffContainerG6) {
      diffContainerG6 = document.createElement("div");
      diffContainerG6.id = "G6-diff";
      diffContainerG6.className = "income-diff";
      document.getElementById("G6").parentNode.appendChild(diffContainerG6);
    }
    if (Math.abs(diffG6) > 0.01) {
      diffContainerG6.textContent = `${diffG6 > 0 ? "+" : ""}${formatPLN(
        diffG6
      )}`;
      diffContainerG6.style.display = "inline";
    } else {
      diffContainerG6.style.display = "none";
    }
  }

  // === UPDATED RYCZAŁT CALCULATIONS USING ALLOCATED REVENUE IF ENABLED ===

  function getAllocatedOrFullRateValue(rateId) {
    if (multipleRatesToggle.checked) {
      const rateInput = document.querySelector(
        `.rate-input[data-for="${rateId}"]`
      );
      if (!rateInput || !rateInput.value) {
        return 0; // Return 0 if the input is empty or not found
      }
      return allocatedRevenues[rateId] || 0;
    }
    return revenue;
  }

  // Ryczałt 2% (C9)
  {
    let base = getAllocatedOrFullRateValue("C9") - F18;
    let C9 = base * 0.02 + C17;
    document.getElementById("C9").value = formatPLN(C9);
  }

  // Ryczałt 3% (D9)
  {
    let base = getAllocatedOrFullRateValue("D9") - F18;
    let D9 = base * 0.03 + C17;
    document.getElementById("D9").value = formatPLN(D9);
  }

  // Ryczałt 5,5% (E9)
  {
    let base = getAllocatedOrFullRateValue("E9") - F18;
    let E9 = base * 0.055 + C17;
    document.getElementById("E9").value = formatPLN(E9);
  }

  // Ryczałt 8,5% (F9)
  {
    let base = getAllocatedOrFullRateValue("F9") - F18;
    let F9 = base * 0.085 + C17;
    document.getElementById("F9").value = formatPLN(F9);
  }

  // Ryczałt 8,5% i 12,5% powyżej 100 000 zł (G9)
  {
    let allocated = getAllocatedOrFullRateValue("G9");
    let G9;
    if (allocated <= 100000) {
      G9 = (allocated - F18) * 0.085 + C17;
    } else {
      G9 = (allocated - (F18 + 100000)) * 0.125 + C17 + 8500;
    }
    document.getElementById("G9").value = formatPLN(G9);
  }

  // Ryczałt 10% (C11)
  {
    let base = getAllocatedOrFullRateValue("C11") - F18;
    let C11 = base * 0.1 + C17;
    document.getElementById("C11").value = formatPLN(C11);
  }

  // Ryczałt 12% (D11)
  {
    let base = getAllocatedOrFullRateValue("D11") - F18;
    let D11 = base * 0.12 + C17;
    document.getElementById("D11").value = formatPLN(D11);
  }

  // Ryczałt 14% (E11)
  {
    let base = getAllocatedOrFullRateValue("E11") - F18;
    let E11 = base * 0.14 + C17;
    document.getElementById("E11").value = formatPLN(E11);
  }

  // Ryczałt 15% (F11)
  {
    let base = getAllocatedOrFullRateValue("F11") - F18;
    let F11 = base * 0.15 + C17;
    document.getElementById("F11").value = formatPLN(F11);
  }

  // Ryczałt 17% (G11)
  {
    let base = getAllocatedOrFullRateValue("G11") - F18;
    let G11 = base * 0.17 + C17;
    document.getElementById("G11").value = formatPLN(G11);
  }

  // Difference displays for ryczałt fields
  const ryczaltFields = [
    { id: "C9", initial: initialC9 },
    { id: "D9", initial: initialD9 },
    { id: "E9", initial: initialE9 },
    { id: "F9", initial: initialF9 },
    { id: "G9", initial: initialG9 },
    { id: "C11", initial: initialC11 },
    { id: "D11", initial: initialD11 },
    { id: "E11", initial: initialE11 },
    { id: "F11", initial: initialF11 },
    { id: "G11", initial: initialG11 },
  ];

  ryczaltFields.forEach((field) => {
    if (field.initial !== null) {
      let currentValue = parsePLN(document.getElementById(field.id).value);
      let diff = currentValue - field.initial;
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

  ryczaltCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const targetId = checkbox.dataset.target;
      const targetInput = document.getElementById(targetId);
      if (targetInput.closest(".input-group").style.display !== "none") {
        // You can add additional logic here if needed
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
    const rateInput =
      this.closest(".checkbox-wrapper").querySelector(".rate-input");

    if (this.checked) {
      targetGroup.style.display = "flex";
      if (multipleRatesToggle.checked) {
        rateInput.classList.add("show");
        rateInput.value = ""; // Clear the input when showing it
        targetInput.value = formatPLN(0); // Reset the tax calculation to 0
      }
    } else {
      targetGroup.style.display = "none";
      rateInput.classList.remove("show");
      rateInput.value = "";
      targetInput.value = formatPLN(0); // Reset the tax calculation to 0 when unchecking
    }

    const anyChecked = Array.from(ryczaltCheckboxes).some((cb) => cb.checked);
    ryczaltMessage.style.display = anyChecked ? "none" : "block";
  });
});

// Modify the spouse income input listeners
spouseIncomeInput.addEventListener("input", (e) => {
  if (!spouseIncomeCard.classList.contains("inactive")) {
    const isValid = validateInput(e.target.value, "spouseIncome");
    if (!resultsSection.classList.contains("hidden") && isValid) {
      calculate(); // This will trigger recalculation when spouse income changes
    }
  }
});

spouseIncomeInput.addEventListener("blur", (e) => {
  if (!spouseIncomeCard.classList.contains("inactive")) {
    e.target.value = formatPLN(parsePLN(e.target.value));
    calculate(); // Also trigger recalculation after formatting
  }
});

// Add this helper function for updating difference displays
function updateDifferenceDisplay(elementId, diff) {
  let diffContainer = document.getElementById(`${elementId}-diff`);
  if (!diffContainer) {
    diffContainer = document.createElement("div");
    diffContainer.id = `${elementId}-diff`;
    diffContainer.className = "income-diff";
    document.getElementById(elementId).parentNode.appendChild(diffContainer);
  }
  if (Math.abs(diff) > 0.01) {
    diffContainer.textContent = `${diff > 0 ? "+" : ""}${formatPLN(diff)}`;
    diffContainer.style.display = "inline";
  } else {
    diffContainer.style.display = "none";
  }
}

// Add event listener for the multiple rates toggle
document
  .getElementById("multipleRatesToggle")
  .addEventListener("change", function (e) {
    const isEnabled = e.target.checked;
    const rateInputs = document.querySelectorAll(".rate-input");
    const revenueInfo = document.querySelector(".multiple-rates-revenue-info");
    const wrapper = document.querySelector(".multiple-rates-wrapper");

    // Toggle revenue info visibility
    revenueInfo.style.display = isEnabled ? "block" : "none";

    // Toggle wrapper justification
    wrapper.style.justifyContent = isEnabled ? "space-between" : "flex-end";

    rateInputs.forEach((input) => {
      if (
        isEnabled &&
        input
          .closest(".checkbox-wrapper")
          .querySelector('input[type="checkbox"]').checked
      ) {
        input.classList.add("show");
      } else {
        input.classList.remove("show");
        input.value = ""; // Clear the input when hiding
      }
    });
    if (isEnabled) {
      updateRemainingRevenue(); // Initialize the remaining revenue display
    }
  });

// Modify the existing checkbox event listeners
ryczaltCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const targetId = this.dataset.target;
    const targetInput = document.getElementById(targetId);
    const targetGroup = targetInput.closest(".input-group");
    const rateInput =
      this.closest(".checkbox-wrapper").querySelector(".rate-input");
    const multipleRatesEnabled = document.getElementById(
      "multipleRatesToggle"
    ).checked;

    if (this.checked) {
      targetGroup.style.display = "flex";
      if (multipleRatesEnabled) {
        rateInput.classList.add("show");
      }
    } else {
      targetGroup.style.display = "none";
      rateInput.classList.remove("show");
      rateInput.value = "";
    }

    const anyChecked = Array.from(ryczaltCheckboxes).some((cb) => cb.checked);
    ryczaltMessage.style.display = anyChecked ? "none" : "block";
  });
});

document.querySelectorAll(".rate-input").forEach((input) => {
  input.addEventListener("input", (e) => {
    // Removed validation for rate inputs
    calculate();
    if (multipleRatesToggle.checked) {
      updateRemainingRevenue();
    }
  });

  input.addEventListener("blur", (e) => {
    if (e.target.value) {
      e.target.value = formatPLN(parsePLN(e.target.value));
      updateRemainingRevenue();
    }
  });

  input.addEventListener("focus", (e) => {
    e.target.select();
  });
});

// Add this near the top with other constants
const multipleRatesToggle = document.getElementById("multipleRatesToggle");
const rateInputs = document.querySelectorAll(".rate-input");
const revenueInfoText = document.querySelector(
  ".multiple-rates-revenue-info p"
);

// Replace the existing toggle event listener
multipleRatesToggle.addEventListener("change", function (e) {
  const isEnabled = e.target.checked;
  const rateInputs = document.querySelectorAll(".rate-input");
  const revenueInfo = document.querySelector(".multiple-rates-revenue-info");
  const wrapper = document.querySelector(".multiple-rates-wrapper");

  revenueInfo.style.display = isEnabled ? "block" : "none";
  wrapper.style.justifyContent = isEnabled ? "space-between" : "flex-end";

  rateInputs.forEach((input) => {
    const wrapper = input.closest(".checkbox-wrapper");
    const checkbox = wrapper.querySelector('input[type="checkbox"]');
    const targetId = checkbox.dataset.target;
    const targetInput = document.getElementById(targetId);

    if (isEnabled && checkbox.checked) {
      input.classList.add("show");
      input.value = ""; // Clear the rate input
      targetInput.value = formatPLN(0); // Reset tax calculation to 0
    } else {
      input.classList.remove("show");
      input.value = "";
      if (!isEnabled && checkbox.checked) {
        calculate(); // Recalculate with full revenue when disabling multiple rates
      }
    }
  });

  if (isEnabled) {
    updateRemainingRevenue();
  } else if (!resultsSection.classList.contains("hidden")) {
    calculate(); // Recalculate all taxes with full revenue
  }
});

// Update the existing checkbox event listeners
ryczaltCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const targetId = this.dataset.target;
    const targetInput = document.getElementById(targetId);
    const targetGroup = targetInput.closest(".input-group");
    const rateInput =
      this.closest(".checkbox-wrapper").querySelector(".rate-input");
    const multipleRatesEnabled = multipleRatesToggle.checked;

    if (this.checked) {
      targetGroup.style.display = "flex";
      if (multipleRatesEnabled) {
        rateInput.classList.add("show");
        // Clear the input when showing it again
        rateInput.value = "";
        updateRemainingRevenue();
      }
    } else {
      targetGroup.style.display = "none";
      rateInput.classList.remove("show");
      rateInput.value = "";
      targetInput.value = formatPLN(0); // Reset the tax calculation to 0 when unchecking
      if (multipleRatesEnabled) {
        updateRemainingRevenue();
      }
    }

    const anyChecked = Array.from(ryczaltCheckboxes).some((cb) => cb.checked);
    ryczaltMessage.style.display = anyChecked ? "none" : "block";
  });
});

// Add input event listeners for rate inputs
rateInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    if (!e.target.value) return;
    const isValid = validateInput(e.target.value, e.target.dataset.for);
    if (!resultsSection.classList.contains("hidden") && isValid) {
      calculate();
    }
    if (multipleRatesToggle.checked) {
      updateRemainingRevenue();
    }
  });

  input.addEventListener("blur", (e) => {
    if (e.target.value) {
      e.target.value = formatPLN(parsePLN(e.target.value));
      updateRemainingRevenue();
    }
  });

  input.addEventListener("focus", (e) => {
    e.target.select();
  });
});

// Add this function after other function declarations
function updateRemainingRevenue() {
  const totalRevenue = parsePLN(revenueInput.value);
  const rateInputs = document.querySelectorAll(".rate-input.show");
  let usedRevenue = 0;

  rateInputs.forEach((input) => {
    if (input.value) {
      usedRevenue += parsePLN(input.value);
    }
  });

  const difference = usedRevenue - totalRevenue;

  if (difference > 0) {
    revenueInfoText.innerHTML = `<span style="color: var(--app-error)">Przekroczono przychód o: ${formatPLN(
      difference
    )}</span>`;
  } else {
    const remainingRevenue = totalRevenue - usedRevenue;
    revenueInfoText.textContent = `Przychód do rozdysponowania: ${formatPLN(
      remainingRevenue
    )}`;
  }
}
