import React, { useRef, useState } from "react";
import TextInput from "./TextInput";
import { EXPENSE_TYPES } from "../constants";
import "./AddExpenseModal.css";

const AddExpenseModal = ({
  setModal,
  expensesFields,
  setExpensesFields,
  index = -1,
  toast,
}) => {
  const isEdit = index >= 0;

  const [row, setRow] = useState(
    isEdit
      ? { ...expensesFields[index] }
      : { label: EXPENSE_TYPES[0], value: "", desc: "", timestamp: new Date() }
  );
  console.log(row, "row");
  const amountRef = useRef(null);
  const otherLabelRef = useRef(null);

  const formatAmount = (value) =>
    value.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleAmountChange = (e) => {
    setRow((prev) => ({
      ...prev,
      value: formatAmount(e.target.value),
    }));
  };

  const handleSave = () => {
    if (row?.label === "Select" || row?.label === "Other") {
      toast.error("Please Select Category");
      return;
    }
    if (!row?.value) {
      toast.error("Please Enter Amount");
      return;
    }

    const updated = isEdit
      ? expensesFields.map((item, i) => (i === index ? row : item))
      : [row, ...expensesFields];

    setExpensesFields(updated);
    setModal({ isOpen: false });
  };

  const handleDelete = () => {
    if (!window.confirm("Do you want to delete this Expense")) return;

    setExpensesFields(expensesFields.filter((_, i) => i !== index));
    setModal({ isOpen: false });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Edit Expense" : "Add Expense"}</h2>

        {/* CATEGORY */}
        <div className="form-group">
          <label>Category</label>

          {row.label !== "Other" && EXPENSE_TYPES.includes(row?.label) ? (
            <select
              value={row.label}
              onChange={(e) => {
                setRow((prev) => ({ ...prev, label: e.target.value }));
                requestAnimationFrame(() =>
                  e.target.value === "Other"
                    ? otherLabelRef.current?.focus()
                    : amountRef.current?.focus()
                );
              }}
            >
              {EXPENSE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          ) : (
            <input
              ref={otherLabelRef}
              className="otherinput"
              type="text"
              value={row.label === "Other" ? "" : row.label}
              placeholder="Enter Category"
              onChange={(e) =>
                setRow((prev) => ({ ...prev, label: e.target.value }))
              }
            />
          )}
        </div>

        {/* AMOUNT */}
        <div className="form-group">
          <label>Amount</label>
          <TextInput
            ref={amountRef}
            value={row.value}
            onChange={handleAmountChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            type="text"
            value={row.desc}
            placeholder="Enter Expense Description"
            onChange={(e) =>
              setRow((prev) => ({ ...prev, desc: e.target.value }))
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button onClick={() => setModal({ isOpen: false })}>Cancel</button>
          <button onClick={handleSave}>Save</button>
          {isEdit && <button onClick={handleDelete}>Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
