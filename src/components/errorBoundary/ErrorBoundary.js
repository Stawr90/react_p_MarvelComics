import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component { //ловит ошибки в дочерних компонентах, рендерит новые данные при ошибке
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage/>
        }

        return this.props.children; //рендерится дочерний компонент ( который обернули )
    }
}

export default ErrorBoundary;