import {AfterViewInit, Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Subject, takeUntil} from 'rxjs';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {FuseNavigationService, FuseVerticalNavigationComponent} from '@fuse/components/navigation';
import {Navigation} from 'app/core/navigation/navigation.types';
import {NavigationService} from 'app/core/navigation/navigation.service';
import {KeycloakService} from "keycloak-angular";
import {CommandService} from "../../../../core/services/command/command.service";
import {Command} from "../../../../models/Command";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
    selector: 'modern-layout',
    templateUrl: './modern.component.html',
    styleUrls: ["modern.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ModernLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isAuthenticated: boolean = false;
    public kcUser: any;
    visible: boolean = false;
    commands: Command[];
    selectedLang: string;
    // Define the languages and their corresponding flags
    languages = [
        { code: 'en', name: 'English', flag: 'assets/images/flags/en.jpg' },
        { code: 'fr', name: 'Français', flag: 'assets/images/flags/fr.jpg' },
        { code: 'ar', name: 'العربية', flag: 'assets/images/flags/ar.jpg' }
    ];

    onLangChange(lang): void {
        this._router.navigate(['/' + lang + this._router.url]);
    }

    showDialog() {
        this.visible = !this.visible;
    }

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        @Inject(LOCALE_ID) public locale: string,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private keycloak: KeycloakService,
        private commandService: CommandService,
        private notificationService: NotificationService
    ) {
        this.selectedLang =  locale;
    }


    getDialogPosition() {
        if (this.locale === 'ar') {
            return { width: '400px', top: '5vh', left: '4vw' };
        } else {
            return { width: '400px', top: '5vh', right: '4vw' };
        }
    }


    ngAfterViewInit(): void {
        this.keycloak.loadUserProfile().then(profile => {
            forkJoin({
                commands: this.commandService.getCommandsByResponsibleId(profile.id),
                responseCommands: this.commandService.getResponseCommand(profile.id)
            }).subscribe(results => {
                this.commands = [...results.commands, ...results.responseCommands];
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.keycloak.loadUserProfile().then(e => {this.kcUser = e;});
        this.notificationService.notificationMessage.subscribe((data) => {
            console.log("im in modern component")
            this.notify(data.commandDto as Command);
        });
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    protected readonly localStorage = localStorage;

    private notify(command: Command) {
        this.commands.unshift(command);
    }
    getSelectedLangFlag(): string {
        const selectedLangObj = this.languages.find(lang => lang.code === this.selectedLang);
        return selectedLangObj ? selectedLangObj.flag : '';
    }

    getSelectedLangName(): string {
        const selectedLangObj = this.languages.find(lang => lang.code === this.selectedLang);
        return selectedLangObj ? selectedLangObj.name : '';
    }

}
