export const getAllowedOrigins = (): string | string[] => {
  const envOrigins = process.env.APP_DATA_ORIGIN_URL;

  // fallback local if env null
  if (!envOrigins || envOrigins.trim() === "") {
    return "http://localhost:5173";
  }

  // split env to several origins separated by comma
  const origins = envOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  // if only 1 return
  if (origins.length === 1) {
    return origins[0];
  }

  // if more than 1 return as array
  return origins;
};
