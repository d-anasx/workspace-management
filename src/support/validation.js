function validateInput(value, type) {
  value = value ? value.trim() : "";

  switch (type) {
    case "name":
    case "company":
    case "expRole":
    case "from":
    case "to":
    case "phone":
      if (!value) {
        return { valid: false, error: "This field is required" };
      }
      return { valid: true, error: "" };

    case "email":
      if (!value) {
        return { valid: false, error: "Email is required" };
      }
      if (!/^[^\s@]+@[^\s@]+\.com+$/.test(value)) {
        return { valid: false, error: "Invalid email format" };
      }
      return { valid: true, error: "" };

    default:
      return { valid: true, error: "" };
  }
}

function validateDateRange(from, to) {

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (fromDate > toDate) {
    return { valid: false, error: "End date must be after start date" };
  }

  return { valid: true, error: "" };
}



export { validateInput, validateDateRange };
