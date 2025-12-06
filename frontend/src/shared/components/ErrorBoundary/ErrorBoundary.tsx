import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
import Button from '@/shared/components/Button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleGoHome = () => {
        window.location.href = '/';
    };

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className={styles.container}>
                    <div className={styles.fallback}>
                        <h1 className={styles.title}>エラーが発生しました</h1>
                        <p className={styles.description}>
                            申し訳ありません。予期せぬエラーが発生しました。
                        </p>
                        <div className={styles.actions}>
                            <Button onClick={this.handleGoHome} variant="primary">
                                ホームに戻る
                            </Button>
                            <Button onClick={this.handleReload} variant="secondary">
                                再読み込み
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
