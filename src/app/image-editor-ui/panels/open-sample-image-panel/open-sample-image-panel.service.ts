import {ElementRef, Injectable} from '@angular/core';
import {Settings} from 'vebto-client/core/config/settings.service';
import {OpenSampleImagePanelComponent} from './open-sample-image-panel.component';
import {OverlayPanel} from 'vebto-client/core/ui/overlay-panel/overlay-panel.service';
import {OverlayPanelRef} from 'vebto-client/core/ui/overlay-panel/overlay-panel-ref';
import {CanvasStateService} from '../../../image-editor/canvas/canvas-state.service';
import {EditorUiService} from '../../editor-ui.service';

@Injectable({
    providedIn: 'root',
})
export class OpenSampleImagePanelService {

    private sampleImagePanelRef: OverlayPanelRef;

    constructor(
        private canvasState: CanvasStateService,
        private config: Settings,
        private overlayPanel: OverlayPanel,
        private editorUi: EditorUiService,
    ) {}

    public open() {
        if ( ! this.shouldShowOpenImageDialog()) return;

        const positionStrategy = this.overlayPanel.overlay.position()
            .flexibleConnectedTo(new ElementRef(this.canvasState.wrapperEl))
            .withPositions([{overlayX: 'center', overlayY: 'center', originX: 'center', originY: 'center'}]);

        this.sampleImagePanelRef = this.overlayPanel.open(
            OpenSampleImagePanelComponent,
            {
                hasBackdrop: true,
                closeOnBackdropClick: false,
                positionStrategy: positionStrategy,
                panelClass: 'floating-panel'
            }
        );
    }

    public reposition() {
        if ( ! this.sampleImagePanelRef) return;
        this.sampleImagePanelRef.updatePosition();
    }

    /**
     * Check if "open image" dialog window should be shown.
     */
    private shouldShowOpenImageDialog() {
        return this.editorUi.isVisible() &&
            this.canvasState.isEmpty() &&
            this.config.get('pixie.ui.openImageDialog.show');
    }
}