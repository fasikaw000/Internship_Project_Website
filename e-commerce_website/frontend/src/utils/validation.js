/**
 * Validation helpers for forms (Ethiopian context: phone, Addis Ababa address).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ethiopian phone: 09XXXXXXXX (10) or 9XXXXXXXX (9) or +2519XXXXXXXX (12 digits after +251)
const ETHIOPIAN_PHONE_REGEX = /^(\+251|0)?[79]\d{8}$/;

export function validateFullName(value) {
  const v = (value || "").trim();
  if (!v) return "Full name is required.";
  if (v.length < 2) return "Full name must be at least 2 characters.";
  if (!/^[a-zA-Z\s\-.']+$/.test(v)) return "Full name can only contain letters, spaces, hyphens, and periods.";
  return null;
}

export function validateUsername(value) {
  const v = (value || "").trim();
  if (!v) return "Username is required.";
  if (v.length < 3) return "Username must be at least 3 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(v)) return "Username can only contain letters, numbers, and underscores.";
  return null;
}

export function validateEmail(value) {
  const v = (value || "").trim();
  if (!v) return "Email is required.";
  if (!EMAIL_REGEX.test(v)) return "Please enter a valid email address.";
  return null;
}

export function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export function validateEthiopianPhone(value) {
  const v = (value || "").replace(/\s|-/g, "").trim();
  if (!v) return "Phone number is required.";
  if (!ETHIOPIAN_PHONE_REGEX.test(v)) return "Please enter a valid Ethiopian phone number (e.g. 0911123456 or +251911123456).";
  return null;
}

const ADDIS_ABABA_SUB_CITIES = [
  "bole", "akaki kality", "arada", "gullele", "kirkos",
  "kolfe keranio", "lideta", "nifas silk", "lemi kura", "yeka", "addis ketema"
];

const ADDIS_ABABA_NEIGHBORHOODS = [
  "goro", "figa", "gerji", "megenagna", "saris", "cmc", "ayat", "kotebe",
  "22", "4 kilo", "5 kilo", "6 kilo", "piassa", "merkato", "sar bet",
  "old airport", "jackros", "salite mehret", "legetafo", "jemo", "lebu", "mexico"
];

export function validateAddressAddisAbaba(value) {
  const v = (value || "").trim().toLowerCase();
  if (!v) return "Address is required.";

  const isAddisAbaba = v.includes("addis ababa") || v.includes("addisababa");
  const isSubCity = ADDIS_ABABA_SUB_CITIES.some(sub => v.includes(sub));
  const isNeighborhood = ADDIS_ABABA_NEIGHBORHOODS.some(n => v.includes(n));
  const isWoreda = v.includes("woreda");

  if (!isAddisAbaba && !isSubCity && !isNeighborhood && !isWoreda) {
    return "Address must be in Addis Ababa (include sub-city, neighborhood like Goro/Bole, or Woreda).";
  }
  return null;
}

export function validateName(value) {
  const v = (value || "").trim();
  if (!v) return "Name is required.";
  if (v.length < 2) return "Name must be at least 2 characters.";
  return null;
}

export function validateMessage(value) {
  const v = (value || "").trim();
  if (!v) return "Message is required.";
  return null;
}
