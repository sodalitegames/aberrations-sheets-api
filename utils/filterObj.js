exports.setAllowedFields = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.setRestrictedFields = (obj, ...restrictedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (!restrictedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
