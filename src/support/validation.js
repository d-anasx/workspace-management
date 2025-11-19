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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { valid: false, error: "Invalid email format" };
      }
      return { valid: true, error: "" };

    default:
      return { valid: true, error: "" };
  }
}

export { validateInput };
