export interface SwalOptions {
    title?: string;
    text?: string;
    icon?: 'warning' | 'error' | 'success' | 'info';
    html?: string;
    timer?: number;
    showCancelButton?: boolean;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
}