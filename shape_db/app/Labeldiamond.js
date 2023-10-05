//とりあえずの置き場
//後日消去する予定


// AllDirectionLocator カスタムロケーターを定義
var AllDirectionLocator = draw2d.layout.locator.Locator.extend({
    init: function () {
        this._super();
    },

    relocate: function (index, targetFigure, sourceFigure) {
    },
});

// LabelDiamond クラス内でポートを定義
LabelDiamond = draw2d.shape.basic.Diamond.extend({
    NAME: "LabelDiamond",

    init : function(attr) {
        this._super(attr);
        this.label = new draw2d.shape.basic.Label({ text: "選択肢", color: "transparent", fontColor: "#0d0d0d" });
        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
        this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

        this.classLabel = new draw2d.shape.basic.Label({
            text: "ClassName", 
            fontColor: "#5856d6",  
            bgColor: "#CCFFFF", 
            padding: 10,
            resizeable: true,
        });
       
        this.add(this.classLabel);
   
        // LabelDiamond クラス内でのポートの宣言
        this.topPort = this.createPort("output", new AllDirectionLocator()); // 上に配置
        this.topPort.setBackgroundColor("#0000FF"); // ポートの背景色を設定

        this.bottomPort = this.createPort("output", new AllDirectionLocator()); // 下に配置
        this.bottomPort.setBackgroundColor("#0000FF"); // ポートの背景色を設定

        this.leftPort = this.createPort("output", new AllDirectionLocator()); // 左に配置
        this.leftPort.setBackgroundColor("#0000FF"); // ポートの背景色を設定

        this.rightPort = this.createPort("output", new AllDirectionLocator()); // 右に配置
        this.rightPort.setBackgroundColor("#0000FF"); // ポートの背景色を設定
    }
});

let labelDiamond = new LabelDiamond({
    width: 60, // 幅を指定
    height: 40, // 高さを指定
});

canvas.getCommandStack().execute(new draw2d.command.CommandAdd(canvas, labelDiamond, 100, 100));