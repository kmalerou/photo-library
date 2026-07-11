import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { App } from "./app/app";


bootstrapApplication(App, {
    providers: [provideZoneChangeDetection(), provideRouter(routes)]
})
  .catch(err => console.error(err));
