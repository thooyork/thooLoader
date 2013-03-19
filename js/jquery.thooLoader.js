
(function( $ ) {

  $.fn.thooLoader = function(options) {
  
    var el,
        defaults,
        settings;

    defaults = {
        size:150,
        color:'0,0,0',
        style:'fill',
        sign:'%'
    };



    settings = $.extend({}, defaults, options);

    el = this;
    this.size = settings.size;
    this.color = settings.color;
    this.style = settings.style;
    this.sign = settings.sign;
    this.onLoadFinished = settings.loadFinished;
    this.onBeforeStart = settings.beforeStart;
    this.onStart = settings.Start;
    this.onReset = settings.Reset;
    this.onClear = settings.Clear;
    this.onPercentageLoad = settings.percentageLoad;

    //alert(settings.percentageLoad);

    this.cnv = document.createElement('canvas');
    this.ctx = this.cnv.getContext('2d');
    this.cnv.width = this.size;
    this.cnv.height = this.size;
    //append canvas to element
    $(this.cnv).appendTo(el); 


    
    this.drawLoader = function (x,y,rad,col,startdeg,enddeg,text,style){

        this.x = x;
        this.y = y;
        this.rad = rad;
        this.col = col;
        this.text = text;
        this.style = style;

        this.startdeg = this.toRadians(startdeg);
        this.enddeg = this.toRadians(enddeg);

        var textSize,
            textWidth;

        //Pie
        if(this.style === 'fill'){
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.arc(this.x, this.y, this.rad, this.startdeg, this.enddeg, false);
            this.ctx.fillStyle = this.col;
            this.ctx.fill();
        }

        if(this.style === 'stroke'){
            this.ctx.beginPath();
            this.ctx.lineWidth = this.size/20;
            this.ctx.arc(this.x, this.y, this.rad, this.startdeg, this.enddeg, false);
            this.ctx.strokeStyle = this.col;
            this.ctx.stroke();
        }


        if(this.style === 'strokefill'){
            this.ctx.beginPath();
            this.ctx.lineWidth = this.size/20;
            this.ctx.arc(this.x, this.y, this.rad, this.startdeg, this.enddeg, false);
            this.ctx.strokeStyle = this.col;
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.moveTo(this.x, this.y);
            this.ctx.arc(this.x, this.y, this.rad - this.ctx.lineWidth, this.startdeg, this.enddeg, false);
            this.ctx.fillStyle = 'rgba('+this.color+',.15)';
            this.ctx.fill();
        }

        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = '#ccc';
        this.ctx.closePath();

        //Text
        this.ctx.textBaseline = 'middle';
        textSize = this.rad/2.5;
        this.ctx.font = 'bold '+textSize+'px PT sans';
        textWidth = this.ctx.measureText (text);
        this.ctx.fillStyle = '#666';
        this.ctx.fillText(text, this.x-(textWidth.width/2), this.y);
  
    }; 

    this.toRadians = function (deg){
        return ( Math.PI / 180 ) * deg;
    }; 

   
    this.update = function(cur, max){

        var start = -90,
            end = 0,
            percent = 0;

        this.trigger('Start');

        //max = 100% and cur = x %
        percent = parseInt((cur * 100)/max,10);
 
        this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height);

        if(percent === 100){
            this.trigger('loadFinished');
        } 

        end = (percent * 3.6)+start;
       
        this.drawLoader(this.size/2, this.size/2, (this.size/2)-(this.size/20), 'rgba(' + this.color + ',.3)',start,end, percent + ' ' + this.sign,this.style);       
    };


    this.reset = function(){
       this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height);
       this.drawLoader(this.size/2, this.size/2, (this.size/2)-(this.size/20), 'rgba(' + this.color + ',.05)',0,360, + '0 ' + this.sign,this.style);
       this.trigger('Reset');
       //this.off('Reset');
    };


    this.clear = function(){
        this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height);
        this.trigger('Clear');
    };


    this.init = function(){
    //draw initial cirlce
    this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height);
    this.drawLoader(this.size/2, this.size/2, (this.size/2)-(this.size/20), 'rgba(' + this.color + ',.05)',0,360, + '0 ' + this.sign,this.style);
    this.trigger('beforeStart');
    //this.off('beforeStart');
    };

    //add eventlistener fctns on custom Event:
    this.on('loadFinished', this.onLoadFinished);
    this.on('beforeStart', this.onBeforeStart);
    this.on('Start', this.onStart);
    this.on('Reset', this.onReset);
    this.on('Clear', this.onClear);
    this.on('percentageLoad', this.onPercentageLoad);
    
    //preserve chainability:
    return this;

  };
})( jQuery );