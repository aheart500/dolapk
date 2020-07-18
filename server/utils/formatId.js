const formatId = (id) => {
  let formedID = `${id}`;
  formedID =
    formedID.length >= 4
      ? formedID
      : formedID.length === 3
      ? `0${formedID}`
      : formedID.length === 2
      ? `00${formedID}`
      : formedID.length === 1
      ? `000${formedID}`
      : formedID;
  formedID = `DP${formedID}`;
  return formedID;
};

module.exports = formatId;
