"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(process.env.AUTH_SERVICE_PORT || 3203);
    console.log(`Auth service running on port ${process.env.AUTH_SERVICE_PORT || 3203}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start auth service:', error);
    process.exit(1);
});
// bootstrap()
//   .then(() => console.log('Auth service started successfully'))
//   .catch((error) => {
//     console.error('Auth service failed to start', error);
//     process.exit(1);
//   });
