import { Injectable } from '@angular/core';
import {ChronoUnit, Duration} from "@js-joda/core";
import {DurationWrapper} from "../interfaces/template-interfaces";
import {FormControl} from "@angular/forms";
import {SimpleUserDetails} from "../interfaces/user-interfaces";
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public static parseChronoStringValue(chronoUnitString: string): ChronoUnit {
    switch (chronoUnitString) {
      case ChronoUnit.MINUTES.toString(): {
        return ChronoUnit.MINUTES;
      }
      case ChronoUnit.HOURS.toString(): {
        return ChronoUnit.HOURS;
      }
      case ChronoUnit.DAYS.toString(): {
        return ChronoUnit.DAYS;
      }
    }
    return ChronoUnit.MINUTES;
  }

  public static createDurationForm(durationString: string): DurationWrapper {
    const duration = Duration.parse(durationString === null ? "PT0M" : durationString);
    let timeUnit = duration.toString().slice(-1);
    var durationWrapper;
    var defaultValue;
    switch (timeUnit) {
      case 'M':
        durationWrapper = {
          duration: duration.toMinutes(),
          timeframe: new FormControl()
        }
        defaultValue = ChronoUnit.MINUTES.toString();
        break;
      case 'H':
        durationWrapper = {
          duration: duration.toMinutes(),
          timeframe: new FormControl()
        }
        defaultValue = ChronoUnit.HOURS.toString();
        break;
      case 'D':
        durationWrapper = {
          duration: duration.toMinutes(),
          timeframe: new FormControl()
        }
        defaultValue = ChronoUnit.DAYS.toString();
        break;
      default:
        durationWrapper = {
          duration: duration.toMinutes(),
          timeframe: new FormControl()
        }
        defaultValue = ChronoUnit.MINUTES.toString();
        break;
    }
    durationWrapper.timeframe.setValue(defaultValue, { onlySelf: true });
    return durationWrapper;
  }

  public static getUserDetails() {
     return <SimpleUserDetails>JSON.parse(localStorage.getItem("userDetails")!);
  }

}
