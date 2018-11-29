function redirectParamsKB(record) {
  const obj = {
    _path: `/eholdings/titles/${record.id}`,
  };

  return obj;
}

function redirectParamsLocal(record) {
  const obj = {
    _path: `/inventory/view/${record.id}`
  };

  return obj;
}

function redirectParams(record) {
  if (record.source === 'kb') {
    return redirectParamsKB(record);
  } else if (record.source === 'local') {
    return redirectParamsLocal(record);
  } else {
    return null;
  }
}

export default redirectParams;
