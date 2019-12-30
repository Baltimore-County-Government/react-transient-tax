import * as Yup from "yup";

import { Form, Formik } from "formik";

import ErrorMessage from "../ErrorMessage";
import ExemptionCertificateField from "../ExemptionCertificateField";
import { HasAtLeast1Exemption } from "../../common/ExemptionUtilities";
import React from "react";

const ExemptionCertificateForm = props => {
  const { nextButton, prevButton, onValidSubmission, formik } = props;
  const { monthlyData = [] } = formik.values;
//console.log(formik);
  return (
    <Formik
      initialValues={{ exemptions: [] , 
        fromDate:"",
        toDate:""}}
      onSubmit={values => {
        onValidSubmission(values);
      }}
      validationSchema={Yup.object({
        exemptions: Yup.array().when(
          ["governmentOnBusiness", "roomRentalCollectionFromNonTransients"],
          {
            is: () => HasAtLeast1Exemption(monthlyData),
            then: Yup.array().min(
              1,
              "At least 1 exemption must be specified when claiming an exemption dollar amount. Please enter above."
            ),
            otherwise: Yup.array().min(0)
          }
        )
      })}
    >
      {props => {
        const { errors = {}, touched } = props;
        console.log(props);
        return(
        <Form>
          <div className="form-1">
            <ExemptionCertificateField formikProps={formik}/>
            <ErrorMessage name="exemptions" />
          </div>
          <div className="tt_form-controls">
            {prevButton}
            {nextButton}
          </div>
        </Form>
        )}}
    </Formik>
  );
};

export default ExemptionCertificateForm;
