import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FuseFullscreenModule } from '@fuse/components/fullscreen';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { UserModule } from 'app/layout/common/user/user.module';
import { SharedModule } from 'app/shared/shared.module';
import { ModernLayoutComponent } from 'app/layout/layouts/horizontal/modern/modern.component';
import {ToastModule} from "primeng/toast";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import { NotificationElementComponent } from './notification-element/notification-element.component';
import {TagModule} from "primeng/tag";
import {FuseAlertModule} from "../../../../../@fuse/components/alert";
import {ImageUrlPipe} from "../../../../core/pipes/imageUrl.pipe";
import {UsernamePipe} from "../../../../core/pipes/username.pipe";
import {AvatarModule} from "primeng/avatar";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
    declarations: [
        ModernLayoutComponent,
        NotificationElementComponent
    ],
    imports: [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        FuseFullscreenModule,
        FuseLoadingBarModule,
        FuseNavigationModule,
        UserModule,
        SharedModule,
        ToastModule,
        ButtonModule,
        DialogModule,
        TagModule,
        FuseAlertModule,
        ImageUrlPipe,
        UsernamePipe,
        AvatarModule,
        MatSelectModule
    ],
    exports     : [
        ModernLayoutComponent,
        NotificationElementComponent
    ]
})
export class ModernLayoutModule
{
}
