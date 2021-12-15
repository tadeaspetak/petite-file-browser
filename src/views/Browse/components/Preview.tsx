import React, { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { BrowserFile, BrowserItem } from "../../../common/types";
import { Modal } from "../../../components";
import { setOrDeleteParam } from "../../../utils";

const Item: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div>
      <strong>{label}: </strong>
      {value}
    </div>
  );
};

export const Preview: React.FC<{ items: BrowserItem[]; preview: string }> = ({
  items,
  preview,
}) => {
  const [params, setParams] = useSearchParams();

  const item = items.find((i) => i.name === preview && i.type === "file") as
    | BrowserFile
    | undefined;

  // note: keep `useCallback`, used in `useEffect` below
  const onClose = useCallback(
    () => void setParams(setOrDeleteParam(params, "preview", undefined)),
    [params, setParams],
  );

  useEffect(() => {
    if (!item) onClose();
  }, [item, onClose]);

  if (!item) return null;

  return (
    <Modal.Wrapper onClose={onClose}>
      <Modal.Title>Meta Info</Modal.Title>
      <Modal.Body>
        <div className="flex flex-col py-2 space-y-2">
          <Item label="Name" value={item.name} />
          <Item label="Size" value={item.sizeHuman} />
          <Item label="Created At" value={new Date(item.createdAt).toUTCString()} />
          <Item label="Updated At" value={new Date(item.updatedAt).toUTCString()} />
        </div>
      </Modal.Body>
    </Modal.Wrapper>
  );
};
