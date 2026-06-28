import { app } from "./app.js";
import { config } from "./config/env.js";

const port = config.PORT;

app.listen(port, () => {
  console.log(`4WHEELS API running on http://localhost:${port}`);
});
