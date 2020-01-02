import * as Yup from "yup";

import { Form, Formik } from "formik";
import React, { useState } from "react";

import AddressLookupField from "../../components/formik/AddressLookupField";
import BasicErrorMessage from "../BasicErrorMessage";
import Field from "../formik/Field";
import PromptIfDirty from "../PromptIfDirty";
import { VerifyAddress } from "../../services/ApiService";

const BasicInformationForm = props => {
  const { nextButton, prevButton, onValidSubmission, initialValues } = props;
  const [isValidAddressMessage, setIsValidAddressMessage] = useState("");

  const ValidateAddress = async addressValue => {
    try {
      const response = await VerifyAddress(addressValue);
      const { Address: { AddressId = 0 } = {} } = response;

      return AddressId;
    } catch (ex) {
      return null;
    }
  };

  const handleAddressChange = () => {
    setIsValidAddressMessage("");
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async values => {
        setIsValidAddressMessage("");
        const { businessAddress, businessAddressParts } = values;
        const shouldGeocode = Object.keys(businessAddressParts).length === 0;
        const addressId = shouldGeocode
          ? await ValidateAddress(businessAddress)
          : businessAddressParts.id;

        if (addressId) {
          onValidSubmission(values);
        } else {
          setIsValidAddressMessage(
            "Please enter a valid Baltimore County address."
          );
        }
      }}
      validationSchema={Yup.object({
        businessName: Yup.string().required("Required"),
        businessAddress: Yup.string().required(
          "A valid Baltimore County address is required"
        )
      })}
    >
      {props => (
        <Form>
          <PromptIfDirty />
          <div className="tt_form-section">
            <Field
              id="businessName"
              name="businessName"
              type="text"
              label="Business Name"
              autoFocus
            />
            <AddressLookupField
              id="businessAddress"
              name="businessAddress"
              label="Business Address"
              minLength={3}
              onChange={handleAddressChange}
            />
            {isValidAddressMessage && (
              <BasicErrorMessage message={isValidAddressMessage} />
            )}
            {props.isSubmitting ? <p>Validating address...</p> : null}
          </div>
          <div className="tt_form-controls">
            {prevButton}
            {nextButton}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BasicInformationForm;
