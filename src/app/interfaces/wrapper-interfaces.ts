import {Observable} from "rxjs";
import {TEMPLATE_TYPE, TemplateDraft} from "./template-interfaces";

export interface funcWrapper<T> {
  (): Observable<T>;
}

export interface mathWrapper {
  (x: number): number;
}

export interface NavDraftEventWrapper {
  type: TEMPLATE_TYPE,
  content: TemplateDraft;
}
