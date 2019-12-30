import React, { useEffect, useState } from "react";
import { Field } from "formik";
import { RadioButton } from "../common/RadioButton";
import DateRangeSelector from "./DateRangeSelector";
import { GetExemptionFormErrors } from "../common/ExemptionUtilities";
import { FormHints } from "../common/Constants";
import { GetExemptionTypes } from "../services/ApiService";

const ExemptionSelector = props => {
  const {
    exemption: exemptionFromProps = {},
    onExemptionSave = () => {},
    form,
    formikProps
  } = props;
  const fromDateVal= form.values.fromDate;
  const toDateVal= form.values.toDate;
  console.log("isExemptionFormDirty", form.values.isExemptionFormDirty);
  console.log('fromDateVal:touched' + form.touched.fromDate );
  console.log('toDateVal:touched' + form.touched.toDate);
  const [isLoading, setIsLoading] = useState(true);
  const [exemptionTypes, setExemptionTypes] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [exemption, setExemption] = useState(exemptionFromProps);
  const [exemptionErrorCheck, setExemptionErrorCheck] = useState(true);
  const [isFromDateDirty, setIsFromDateDirty] = useState(
    !form.values.isExemptionFormDirty ? false : true
  );
  const [isToDateDirty, setIsToDateDirty] = useState(
    !form.values.isExemptionFormDirty ? false : true
  );
  console.log("---------form---------------");
 
  console.log("isFromDateDirty:" + isFromDateDirty);
  console.log("isToDateDirty:" + isToDateDirty);
  console.log("--------form-------------");
  useEffect(() => {
    if (exemptionTypes.length === 0) {
      GetExemptionTypes()
        .then(exemptionTypes => {
          setExemptionTypes(exemptionTypes);
          setIsLoading(false);
        })
        .catch(error => props.history.push("/error", { ...error }));
    }
  }, [exemptionTypes, props]);

  useEffect(() => {
    setExemption(exemptionFromProps);
  }, [exemptionFromProps]);

  useEffect(() => {
    if (isFormDirty) {
      setFormErrors(
        GetExemptionFormErrors(
          exemption,
          isFromDateDirty,
          isToDateDirty,
          exemptionErrorCheck
        )
      );
    }
  }, [
    isFormDirty,
    exemption,
    exemptionErrorCheck,
    isFromDateDirty,
    isToDateDirty
  ]);

  const saveExemption = () => {
    const errors = GetExemptionFormErrors(
      exemption,
      isFromDateDirty,
      isToDateDirty
    );
    setExemptionErrorCheck(true);
    console.log("error --length:" + errors.length);
    if (
      errors.length === 0 &&
      isFromDateDirty === true &&
      isToDateDirty === true
    ) {
      onExemptionSave(exemption);
      resetSelector();
      props.form.setFieldValue("fromDate", "");
      props.form.setFieldValue("toDate", "");
     // setIsFromDateDirty(false);
      //setIsToDateDirty(false); 
    form.setFieldTouched("toDate",false);
    } else {
      setFormErrors(errors);
    }
  };

  const handleExemptionTypeChange = ({ type, label }) => {
    setIsFormDirty(true);
    setExemptionErrorCheck(false);
    setExemption({
      ...exemption,
      ...{ type, label }
    });
  };

  const handleExemptionDateChange = ({ fromDate, toDate, fromOrTo }) => {
    setIsFormDirty(true);
    setExemptionErrorCheck(true);
    setExemption({
      ...exemption,
      ...{ fromDate, toDate }
    });
    props.form.setFieldValue("fromDate", fromDate);
    props.form.setFieldValue("toDate", toDate);
    if (fromOrTo === 1) {
      props.form.setFieldTouched("fromDate", true);
      setIsFromDateDirty(true);
    } else {
      console.log("in --else");
      props.form.setFieldTouched("toDate", true);
      //form.errors.toDate = "To Date Required";
      setIsToDateDirty(true);
    }

    //  console.log('fromDate:touched:');
    // console.log( props.form.touched.fromDate);
    //  console.log('toDate:touched:' + props.form.touched.);
  };

  const resetSelector = () => {
    //  props.form.setFieldTouched("fromDate",false);
    //props.form.setFieldTouched("toDate",false);

    setIsFormDirty(false);
    setExemption({});
  };

  return isLoading ? (
    <p>Loading Exemption Form...</p>
  ) : (
    <div className="tt_exemption-selector">
      {formErrors.length > 0 && (
        <ul className="tt_error-list">
          {formErrors.map(({ key, error }) => (
            <li key={key}>{error}</li>
          ))}
        </ul>
      )}
      {exemptionTypes.map(exemptionType => {
        const { Id: type, Description: label } = exemptionType;
        const hint =
          label.toLowerCase() === "non-transient" ? FormHints.NonTransient : "";
        const formLabel = hint ? `${label} ( ${hint} )` : label;

        const handleChange = () => {
          handleExemptionTypeChange({ type, label });
        };

        return (
          <Field
            key={type}
            component={RadioButton}
            name="exemptionType"
            id={`exemptionType-${type}`}
            label={formLabel}
            value={type}
            onChange={handleChange}
            checked={exemption.type === type}
          />
        );
      })}
      <DateRangeSelector
        fromDate={exemption.fromDate}
        toDate={exemption.toDate}
        handleChange={handleExemptionDateChange}
        formikProps={formikProps}
      />
      <button onClick={saveExemption} type="button">
        {exemption.id ? "Update" : "Add"}
      </button>
    </div>
  );
};

export default ExemptionSelector;
