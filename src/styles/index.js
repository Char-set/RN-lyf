import SmartStyleSheet from "./SmartStyleSheet.js";

module.exports = SmartStyleSheet.create({
    "common-style": {
        "container": {
            "backgroundColor": "#fff",
            "paddingTop": 20
        },
        "pdT20": {
            "paddingTop": "20pt"
        },
        "pdT45": {
            "paddingTop": "45pt"
        }
    },
    "user-style": {
        "container": {
            "backgroundColor": "#f0f0f0",
            "paddingBottom": "44pt"
        },
        "my-info": {
            "height": "170pt",
            "paddingTop": "10pt",
            "flex": 1,
            "alignItems": "center"
        },
        "login-status": {
            "width": "60vw",
            "backgroundColor": "transparent",
            "display": "flex",
            "flexDirection": "row",
            "marginTop": "50pt"
        },
        "login-status-li": {
            "height": "60pt",
            "flex": 1,
            "justifyContent": "center",
            "alignItems": "center"
        },
        "login-status-li-span": {
            "borderRadius": "15pt",
            "backgroundColor": "#ffc600",
            "paddingTop": 0,
            "paddingBottom": 0,
            "paddingRight": "4pt",
            "paddingLeft": "4pt",
            "width": "45pt",
            "alignItems": "center"
        },
        "login-status-li-span-text": {
            "color": "#fff",
            "fontSize": "14pt"
        },
        "login-status-li-text": {
            "color": "#fff",
            "marginTop": "5pt"
        },
        "login-status-li-img": {
            "height": "60pt",
            "width": "60pt",
            "borderRadius": "30pt"
        },
        "login-btn": {
            "display": "flex",
            "flexDirection": "row",
            "backgroundColor": "transparent",
            "marginTop": "10pt"
        },
        "login-btn-text": {
            "color": "#fff",
            "paddingRight": "5pt",
            "fontSize": "14pt"
        },
        "panel": {
            "paddingBottom": "10pt",
            "backgroundColor": "#fff"
        },
        "panel-include": {
            "paddingRight": "15pt",
            "marginLeft": "15pt",
            "height": "44pt",
            "alignItems": "center",
            "overflow": "hidden",
            "display": "flex",
            "flexDirection": "row",
            "borderBottomWidth": "1pt",
            "borderStyle": "solid",
            "borderBottomColor": "#ddd"
        },
        "panel-icon": {
            "width": "15pt",
            "height": "18pt",
            "marginRight": "9pt"
        },
        "panel-text": {
            "fontSize": "14pt"
        },
        "panel-tips": {
            "color": "#808080",
            "position": "absolute",
            "right": "30pt"
        },
        "panel-tips-img": {
            "width": "8pt",
            "height": "15pt",
            "position": "absolute",
            "right": "15pt"
        },
        "panel-content": {
            "paddingTop": 0,
            "paddingRight": 0,
            "paddingBottom": "10pt",
            "paddingLeft": 0,
            "backgroundColor": "#fff",
            "display": "flex",
            "flexDirection": "row",
            "alignItems": "center",
            "justifyContent": "center",
            "marginBottom": "10pt"
        },
        "panel-content-li": {
            "flex": 1,
            "alignItems": "center",
            "justifyContent": "center"
        },
        "panel-content-li-icon": {
            "width": "24pt",
            "height": "24pt"
        },
        "panel-content-li-text": {
            "color": "#333",
            "fontSize": "12pt",
            "marginTop": "5pt"
        },
        "panel-content-li-accounts": {
            "color": "#ff6900",
            "fontSize": "16pt"
        },
        "panel-content-li-tips": {
            "position": "absolute",
            "paddingTop": 0,
            "paddingBottom": 0,
            "paddingRight": "4pt",
            "paddingLeft": "4pt",
            "borderRadius": "7pt",
            "backgroundColor": "#ff6900",
            "justifyContent": "center",
            "alignItems": "center",
            "right": "15pt",
            "top": -5
        },
        "panel-content-li-tips-text": {
            "color": "#fff",
            "fontSize": "12pt"
        }
    }
});

