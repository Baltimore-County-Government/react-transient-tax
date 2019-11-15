import React, { useState, useEffect } from "react";
import ExemptionSelector from "./ExemptionSelector";
import ExemptionsList from "./ExemptionList";
import { AddOrUpdate } from "../common/ArrayUtilities";
import { SaveExemption } from "../services/ApiService";
import { Field } from "formik";

const ExemptionCertificate = ({
  field, // { name, value, onChange, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const { setFieldValue } = form;
  const [exemption, setExemption] = useState({});
  const [exemptions, setExemptions] = useState([]);

  useEffect(() => {
    setFieldValue("exemptions", exemptions);
  }, [exemptions, setFieldValue]);

  const saveExemption = exemption => {
    const savedExemption = SaveExemption(exemption);
    const updatedExemptions = AddOrUpdate(exemptions, savedExemption);

    setExemptions(updatedExemptions);
  };

  const editExemption = exemptionToEdit => {
    setExemption({ ...exemptionToEdit });
  };

  const removeExemption = exemptionId => {
    setExemptions(exemptions.filter(exemption => exemption.id !== exemptionId));
  };

  return (
    <div className="tt_form-section">
      <p>
        I certify that the occupancy of the facilities above have been (or will
        be) furnished for the exclusive use of and will be paid by or from the
        funds of:
      </p>
      <ExemptionSelector
        exemption={exemption}
        onExemptionSave={saveExemption}
      />
      {exemptions.length > 0 && (
        <ExemptionsList
          exemptions={exemptions}
          handleEditClick={editExemption}
          handleRemoveClick={removeExemption}
        />
      )}
      <p>
        That all of the qualifications explained on this form have been met so
        as to exempt this occupancy from the tax imposed by County Code
        11-4-401.
      </p>
    </div>
  );
};

const ExemptionCertificateField = props => (
  <Field component={ExemptionCertificate} {...props} />
);

export default ExemptionCertificateField;