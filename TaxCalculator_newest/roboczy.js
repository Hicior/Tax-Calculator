// Add this helper function to get rate input value
function getRateInputValue(targetId) {
  const rateInput = document.querySelector(
    `.rate-input[data-for="${targetId}"]`
  );
  return rateInput && rateInput.classList.contains("show")
    ? parsePLN(rateInput.value)
    : 0;
}

// In the calculate function, replace the ryczałt calculations with:
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

  // Get the total revenue for health contribution calculation
  let totalRevenue = multipleRatesToggle.checked
    ? Array.from(document.querySelectorAll(".rate-input.show")).reduce(
        (sum, input) => sum + parsePLN(input.value),
        0
      )
    : revenue;

  // Update C17 calculation to use totalRevenue
  if (totalRevenue > 300000) {
    C17 = 12 * 1258.39;
  } else if (totalRevenue > 60000) {
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

    // Add difference display for C6_joint
    if (initialC6_joint !== null) {
      let diffC6_joint = C6_joint - initialC6_joint;
      updateDifferenceDisplay("C6_joint", diffC6_joint);
    }
  }

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

  // IP BOX skala podatkowa (F6) - without joint taxation
  let F6 =
    income * ipBoxCoeff * 0.05 +
    Math.min(J3, 30000) * 0 +
    Math.min(Math.max(J3 - 30000, 0), 90000) * 0.12 +
    Math.min(Math.max(J3 - 120000, 0), 880000) * 0.32 +
    Math.max(J3 - 1000000, 0) * 0.36 +
    C18;
  document.getElementById("F6").value = formatPLN(F6);

  // IP BOX skala podatkowa (F6_joint) - with joint taxation
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

    // Add difference display for F6_joint
    if (initialF6_joint !== null) {
      let diffF6_joint = F6_joint - initialF6_joint;
      updateDifferenceDisplay("F6_joint", diffF6_joint);
    }
  }

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

  // Ryczałt calculations
  if (multipleRatesToggle.checked) {
    // Using individual rate inputs
    let C9 = (getRateInputValue("C9") - F18) * 0.02 + C17;
    let D9 = (getRateInputValue("D9") - F18) * 0.03 + C17;
    let E9 = (getRateInputValue("E9") - F18) * 0.055 + C17;
    let F9 = (getRateInputValue("F9") - F18) * 0.085 + C17;

    // Special case for G9 (8.5% and 12.5%)
    let rateG9 = getRateInputValue("G9");
    let G9;
    if (rateG9 <= 100000) {
      G9 = (rateG9 - F18) * 0.085 + C17;
    } else {
      G9 = (rateG9 - (F18 + 100000)) * 0.125 + C17 + 8500;
    }

    let C11 = (getRateInputValue("C11") - F18) * 0.1 + C17;
    let D11 = (getRateInputValue("D11") - F18) * 0.12 + C17;
    let E11 = (getRateInputValue("E11") - F18) * 0.14 + C17;
    let F11 = (getRateInputValue("F11") - F18) * 0.15 + C17;
    let G11 = (getRateInputValue("G11") - F18) * 0.17 + C17;

    // Update DOM
    document.getElementById("C9").value = formatPLN(C9);
    document.getElementById("D9").value = formatPLN(D9);
    document.getElementById("E9").value = formatPLN(E9);
    document.getElementById("F9").value = formatPLN(F9);
    document.getElementById("G9").value = formatPLN(G9);
    document.getElementById("C11").value = formatPLN(C11);
    document.getElementById("D11").value = formatPLN(D11);
    document.getElementById("E11").value = formatPLN(E11);
    document.getElementById("F11").value = formatPLN(F11);
    document.getElementById("G11").value = formatPLN(G11);
  } else {
    // Original calculations using total revenue
    // Ryczałt 2% (C9)
    let C9 = (revenue - F18) * 0.02 + C17;
    document.getElementById("C9").value = formatPLN(C9);

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
  }

  // Repeat the same pattern for other ryczałt fields
  const ryczaltFields = [
    { id: "C9", value: C9, initial: initialC9 },
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
