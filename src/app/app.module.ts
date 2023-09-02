import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WeatherComponent } from './sidebar/weather/weather.component';
import { NotificationsComponent } from './sidebar/notifications/notifications.component';
import { HelloComponent } from './sidebar/hello/hello.component';
import { StatusComponent } from './sidebar/status/status.component';
import { SettingsComponent } from './sidebar/settings/settings.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { LiveControllerComponent } from './live-controller/live-controller.component';
import { FountainComponent } from './live-controller/fountain/fountain.component';
import { ConfigurationPanelComponent } from './live-controller/configuration-panel/configuration-panel.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FloatingBlocksComponent } from './dashboard/floating-blocks/floating-blocks.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CardBarComponent } from './dashboard/card-bar/card-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TemplatesComponent } from './templates/templates.component';
import { FountainSideviewComponent } from './live-controller/fountain-sideview/fountain-sideview.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SchedulingArrayComponent } from './schedule/scheduling-array/scheduling-array.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MyTemplatesComponent } from './templates/my-templates/my-templates.component';
import { TemplatesListComponent } from './templates/templates-list/templates-list.component';
import { TemplateCardComponent } from './templates/template-card/template-card.component';
import { PanicButtonComponent } from './sidebar/panic-button/panic-button.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogWindowComponent } from './reusable-components/dialog-window/dialog-window.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LogsComponent } from './admin-panel/logs/logs.component';
import { UsersComponent } from './admin-panel/users/users.component';
import { MatSelectModule } from '@angular/material/select';
import { TemplateCardsSnippetComponent } from './floating-blocks-folder/template-cards-snippet/template-cards-snippet.component';
import { TemplateCardSnippetComponent } from "./floating-blocks-folder/template-cards-snippet/template-card-snippet/template-card-snippet.component";
import { MobileViewComponent } from './live-controller/mobile-view/mobile-view.component';
import { NotificationModalComponent } from './sidebar/notifications/notification-modal/notification-modal.component';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditingToolComponent } from './editing-tool/editing-tool.component';
import { TimelineComponent } from './editing-tool/timeline/timeline.component';
import { DialogAddBlockComponent } from './editing-tool/dialogs/dialog-add-block/dialog-add-block.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {ConfigComponent} from "./admin-panel/config/config.component";
import { BlockComponent } from './editing-tool/block/block.component';
import { DialogBlockOptionsComponent } from './editing-tool/dialogs/dialog-block-options/dialog-block-options.component';
import { LoadingSpinnerComponent } from './reusable-components/loading-spinner/loading-spinner.component';
import { LoadingScreenComponent } from './reusable-components/loading-screen/loading-screen.component';
import { RecentActivitySnippetComponent } from './floating-blocks-folder/recent-activity-snippet/recent-activity-snippet/recent-activity-snippet.component';
import { MatChipsModule } from '@angular/material/chips';
import { TemplateCardAddFormComponent } from './schedule/schedule-add-form/template-card-add-form/template-card-add-form.component';
import { DialogYesNoOptionsComponent } from './editing-tool/dialogs/dialog-yes-no-options/dialog-yes-no-options.component';
import { ScheduleAddFormComponent } from './schedule/schedule-add-form/schedule-add-form.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {LoadingBarComponent} from './reusable-components/loading-bar/loading-bar.component';
import {
  ScheduleCardSnippetComponent
} from "./floating-blocks-folder/schedule-cards-snippet/schedule-card-snippet/schedule-card-snippet.component";
import {
  ScheduleCardsSnippetComponent
} from "./floating-blocks-folder/schedule-cards-snippet/schedule-cards-snippet.component";
import {
  DraftCardSnippetComponent
} from "./floating-blocks-folder/draft-cards-snippet/draft-card-snippet/draft-card-snippet.component";
import {DraftCardsSnippetComponent} from "./floating-blocks-folder/draft-cards-snippet/draft-cards-snippet.component";


@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        WeatherComponent,
        NotificationsComponent,
        HelloComponent,
        StatusComponent,
        SettingsComponent,
        SidebarComponent,
        LiveControllerComponent,
        FountainComponent,
        ConfigurationPanelComponent,
        NavbarComponent,
        DashboardComponent,
        FloatingBlocksComponent,
        NotFoundComponent,
        TemplatesComponent,
        CardBarComponent,
        FountainSideviewComponent,
        ScheduleComponent,
        SchedulingArrayComponent,
        MyTemplatesComponent,
        TemplatesListComponent,
        TemplateCardComponent,
        PanicButtonComponent,
        DialogWindowComponent,
        AdminPanelComponent,
        LogsComponent,
        UsersComponent,
        TemplateCardsSnippetComponent,
        TemplateCardSnippetComponent,
        MobileViewComponent,
        NotificationModalComponent,
        ScheduleAddFormComponent,
        TemplateCardAddFormComponent,
        EditingToolComponent,
        TimelineComponent,
      LoadingBarComponent,
        DialogAddBlockComponent,
        BlockComponent,
        DialogBlockOptionsComponent,
        LoadingSpinnerComponent,
        LoadingScreenComponent,
        RecentActivitySnippetComponent,
        DialogYesNoOptionsComponent,
        ConfigComponent,
        ScheduleCardSnippetComponent,
        ScheduleCardsSnippetComponent,
      DraftCardSnippetComponent,
      DraftCardsSnippetComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FlexLayoutModule,
        HttpClientModule,
        FormsModule,
        NgOptimizedImage,
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatExpansionModule,
        MatMenuModule,
        ColorPickerModule,
        MatSliderModule,
        CommonModule,
        MatTabsModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatTableModule,
        MatChipsModule,
      DragDropModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
