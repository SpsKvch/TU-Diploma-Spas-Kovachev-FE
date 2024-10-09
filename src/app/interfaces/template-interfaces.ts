import {Time} from "@angular/common"
import {FormControl} from "@angular/forms";
import {ChronoUnit, Duration, ZonedDateTime} from "@js-joda/core";

export interface GenericTemplate {
  id: string
  title: string,
  content: string,
  imageUrl: string | null,
  requirements: Requirement[],
  steps: Step[]
}

export interface CompleteTemplate {
  id: string,
  views: number,
  branches: number,
  approvals: number,
  totalEngagements: number,
  creatorName: string,
  sharedWith: string[],
  title: string,
  requirements: Requirement[],
  content: string,
  imageUrl: string | null,
  category: string,
  tags: string[],
  accessStatus: string,
  branchPermission: string,
  steps: Step[],
  parentDetails: ParentDetails,
  createTime: Date
}

export interface CompleteTemplatePage {
  total: number,
  content: CompleteTemplate[],
  totalPages: number;
}

export interface TemplateDraft extends GenericTemplate {
  creatorName: string | null,
  parentTemplateId: string | null,
  creationDate: Date | null,
  lastUpdateTime: Date | null
}

export interface TemplateJournal {
  id: string,
  ownerName: string,
  originalTemplate: GenericTemplate,
  newTitle: string | null,
  markedUpContent: string | null,
  markedUpImage: string | null,
  trackedSteps: TrackedStep[] | null,
  trackedRequirements: Requirement[] | null,
  currentStatus: ProgressionStatus,
  creationTime: Date,
  updateTime: Date
}

export interface NavDetails {
  title: string,
  steps: string[],
  type: TEMPLATE_TYPE
}

export interface Requirement {
  content: string,
  group: string,
  optional: boolean
}

export interface Step {
  title: string,
  content: string,
  imageUrl: string | null,
  minTimeEstimate: string,
  maxTimeEstimate: string,
  important: boolean,
  optional: boolean
}

export interface TrackedStep {
  markedUpTitle: string,
  markedUpContent: string,
  markedUpImage: string | null,
  notes: string,
  timeSpent: string,
  progressionStatus: ProgressionStatus,
  optional: boolean
}

export interface ParentDetails {
  parentId: string,
  visibleToOthers: boolean,
  statusPromotable: boolean;
}

export interface ErrorResponse {
  exceptionName: string,
  messages: string[],
  stackTrace: string[]
}

export interface CompleteTemplateRequest {
  categoryId: string,
  tags: string[],
  accessStatus: string,
  branchPermission: string,
  sharedWith: string
}

export interface TemplateDraftRequest {
  title: string,
  content: string,
  imageUrl: string | null,
  steps: CreateStepRequest[],
  requirements: Requirement[]
}

export interface UpdateJournalRequest {
  newTitle: string,
  markedUpContent: string,
  markedUpImageUrl: string | null,
  trackedSteps: Record<number, TrackedStepRequest>,
  trackedRequirements: Requirement[],
  newStatus: ProgressionStatus,
}

export interface TrackedStepRequest {
  title: string,
  markedUpContent: string,
  imageUrl: string | null,
  notes: string[],
  timeSpent: string,
  progressionStatus: string,
}

export interface CreateStepRequest {
  title: string,
  content: string,
  imageUrl: string | null,
  minTimeEstimate: string,
  maxTimeEstimate: string,
  important: boolean,
  optional: false
}

export interface CreateStepForm {
  title: string,
  content: string,
  imageUrl: string,
  minTimeEstimate: DurationWrapper,
  maxTimeEstimate: DurationWrapper,
  important: boolean,
  optional: false
}

export interface DurationWrapper {
  duration: number,
  timeframe: FormControl
}

export interface LoginRequest {
  username: string,
  password: string
}

export interface RegistrationRequest {
  authorizationRequest: LoginRequest,
  createTemplateUserRequest: CreateTemplateUserRequest
}

export interface CategoryDetails {
  id: string,
  categoryName: string,
  childTags: string[],
  creationTime: Date,
  updateTime: Date
}

export interface CreateTemplateUserRequest {
  firstName: string,
  lastName: string,
  email: string,
}

export interface TemplateSearchFilters {
  title: string,
  category: string,
  tags: string[],
  minApproval: number,
  minDate: Date | null,
  maxDate: Date | null,
  completionTimePeriod: string,
  maxCompletionTime: number,
  isOriginal: boolean,
  completionRate: number
}

export interface FiltersRequest {
  title: string | null,
  categoryName: string | null,
  tags: string[] | null,
  minDate: Date | null,
  maxDate: Date | null,
  isOriginal: boolean | null,
  minApprovalPercent: number | null,
  maxCompletionTime: Duration | null,
  minCompletionRate: number | null
}

export interface InternalFilters {
  minApprovalPercent: number,
  maxCompletionTime: Duration,
  minCompletionRate: number
}

export enum TEMPLATE_TYPE {
  COMPLETE,
  DRAFT,
  JOURNAL
}

export enum ProgressionStatus {
  NOT_STARTED = <any>"Not started",
  IN_PROGRESS = <any>"In progress",
  COMPLETED = <any>"Completed",
  PARTIALLY_COMPLETED = <any>"Partially completed",
  ABANDONED = <any>"Abandoned",
  ON_HOLD = <any>"On hold"
}
