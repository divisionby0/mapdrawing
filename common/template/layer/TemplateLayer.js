var TemplateLayer = (function () {
    function TemplateLayer(aspectRatio, type, left, top, right, bottom, changeable) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = true; }
        this.aspectRatio = aspectRatio;
        this.type = type;
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.changeable = changeable;
    }
    TemplateLayer.prototype.isChangeable = function () {
        return this.changeable;
    };
    TemplateLayer.prototype.hasLeft = function () {
        if (this.left != null && this.left != undefined && this.left != "") {
            return true;
        }
        else {
            return false;
        }
    };
    TemplateLayer.prototype.hasTop = function () {
        if (this.top != null && this.top != undefined && this.top != "") {
            return true;
        }
        else {
            return false;
        }
    };
    TemplateLayer.prototype.hasRight = function () {
        if (this.right != null && this.right != undefined && this.right != "") {
            return true;
        }
        else {
            return false;
        }
    };
    TemplateLayer.prototype.hasBottom = function () {
        if (this.bottom != null && this.bottom != undefined && this.bottom != "") {
            return true;
        }
        else {
            return false;
        }
    };
    TemplateLayer.prototype.getTop = function () {
        return this.top;
    };
    TemplateLayer.prototype.getLeft = function () {
        return this.left;
    };
    TemplateLayer.prototype.getRight = function () {
        return this.right;
    };
    TemplateLayer.prototype.getBottom = function () {
        return this.bottom;
    };
    TemplateLayer.prototype.getType = function () {
        return this.type;
    };
    TemplateLayer.prototype.getAspectRatio = function () {
        return this.aspectRatio;
    };
    return TemplateLayer;
}());
//# sourceMappingURL=TemplateLayer.js.map