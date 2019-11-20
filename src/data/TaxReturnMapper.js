const GetDataForMonth = (taxReturn, monthIndex) => {
  const {
    monthsToReport,
    grossOccupancy,
    governmentOnBusiness,
    roomRentalCollectionFromNonTransients
  } = taxReturn;
  const returnDate = monthsToReport[monthIndex];

  return {
    /** month is 0 based so 11 = December but server is not 0 based */
    month: returnDate.getMonth() + 1,
    year: returnDate.getFullYear(),
    grossRentalCollected: grossOccupancy[monthIndex],
    nonTransientRentalCollected:
      roomRentalCollectionFromNonTransients[monthIndex],
    governmentExemptRentalCollected: governmentOnBusiness[monthIndex]
    /** TODO: These are all calculated, so I'm assuming we don't send these over? */
    // taxRemitted: 0.0,
    // interestRemitted: 0.0,
    // penaltyRemitted: 0.0,
  };
};

const MapExemptionsToServerModel = exemptions =>
  exemptions.map(({ fromDate: startDate, toDate: endDate, type: typeId }) => ({
    startDate,
    endDate,
    typeId
  }));

const MapTaxReturnToServerModel = taxReturn => {
  const { monthsToReport, exemptions } = taxReturn;
  const monthData = Object.keys(monthsToReport).map(monthKey =>
    GetDataForMonth(taxReturn, monthKey)
  );
  const mappedExemptions = MapExemptionsToServerModel(exemptions);
  return { ...taxReturn, monthData, ...{ exemptions: mappedExemptions } };
};

export { GetDataForMonth, MapTaxReturnToServerModel };
