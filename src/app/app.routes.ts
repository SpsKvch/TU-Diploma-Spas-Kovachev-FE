import {Routes} from '@angular/router';
import {TemplateViewComponent} from './template-view/template-view.component';
import {HomepageComponent} from './homepage/homepage.component';
import {CreateTemplateComponent} from './create-template/create-template.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {validJwtGuard} from './valid-jwt.guard';
import {TemplateJournalComponent} from "./template-journal/template-journal.component";
import {UnknownComponent} from "./unknown/unknown.component";
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {adminPermissionGuard} from "./admin-permission.guard";
import {UsersViewComponent} from "./users-view/users-view.component";

export const routes: Routes = [
  {path: "home", component: HomepageComponent, pathMatch: "full"},
  {path: "login", component: LoginComponent, pathMatch: "full"},
  {path: "register", component: RegisterComponent, pathMatch: "full"},
  // { path: "templates/branch", component: CreateTemplateComponent, canActivate: [validJwtGuard] },
  {path: "templates/myDrafts/:id", component: CreateTemplateComponent, canActivate: [validJwtGuard]},
  {path: "templates/journal/:id", component: TemplateJournalComponent, canActivate: [validJwtGuard]},
  {path: "templates/:id", component: TemplateViewComponent},
  //{ path: "users/myProfile", component: ProfileViewComponent, canActivate: [validJwtGuard] },
  {path: "users", component: UsersViewComponent},
  {path: "users/:username", component: ProfileViewComponent},
  {path: "admin", component: AdminPanelComponent, canActivate: [validJwtGuard, adminPermissionGuard]},
  {path: "", component: HomepageComponent},
  {path: "**", component: UnknownComponent}];
