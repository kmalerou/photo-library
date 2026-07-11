import { provideZoneChangeDetection, importProvidersFrom } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";


bootstrapApplication(AppComponent, {
    providers: [provideZoneChangeDetection(), importProvidersFrom(BrowserModule, AppRoutingModule)]
})
  .catch(err => console.error(err));
