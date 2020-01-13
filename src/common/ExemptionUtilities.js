/**
 * Quick Solution for Validating Exemption Errors Outside of Formik
 * @param {object} exemption object representation of an exemption
 */
const GetExemptionFormErrors = exemption => {
  const activeFormErrors = [];
  const { fromDate, toDate, type } = exemption;

  if (!type) {
    activeFormErrors.push({
      key: "exemptionType",
      error: "Exemption Type Required"
    });
  }

  if (!fromDate) {
    activeFormErrors.push({ key: "fromDate", error: "From Date Required" });
  }

  if (!toDate) {
    activeFormErrors.push({ key: "toDate", error: "To Date Required" });
  }

  if (fromDate && toDate) {
    if (parseInt(fromDate.getTime()) > parseInt(toDate.getTime())) {
      activeFormErrors.push({
        key: "badDateRange",
        error: "To Date must come after from date"
      });
    }
  }

  return activeFormErrors;
};

/**
 * Check to verify if a given exemption field has an value less than 0.
 * Note: Exemption values are negative
 * @param {array} exemptionTotals Array of exemption field total objects
 */
const HasAtLeast1Exemption = (monthlyData = []) =>
  monthlyData.some(
    ({
      nonTransientRentalCollected = 0,
      governmentExemptRentalCollected = 0
    }) => !!governmentExemptRentalCollected || !!nonTransientRentalCollected
  );

export { GetExemptionFormErrors, HasAtLeast1Exemption };
