/**
 *
 *      ┌─┐╔═╗┌┬┐┌─┐
 *      │  ║ ║ ││├┤
 *      └─┘╚═╝─┴┘└─┘
 *   ┌─┐┌─┐╔╗╔┬  ┬┌─┐┌─┐
 *   │  ├─┤║║║└┐┌┘├─┤└─┐
 *   └─┘┴ ┴╝╚╝ └┘ ┴ ┴└─┘
 *
 * Copyright (c) 2016 Code on Canvas Pty Ltd, http://CodeOnCanvas.cc
 *
 * This software is distributed under the MIT license
 * https://tldrlegal.com/license/mit-license
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code
 *
 **/

map = function(value, inputMin, inputMax, outputMin, outputMax, clamp) {
  if (Math.abs(inputMin - inputMax) < Number.EPSILON){
      return outputMin;
  } else {
      var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);

      if( clamp ){
          if(outputMax < outputMin){
              if( outVal < outputMax )outVal = outputMax;
              else if( outVal > outputMin )outVal = outputMin;
          }else{
              if( outVal > outputMax )outVal = outputMax;
              else if( outVal < outputMin )outVal = outputMin;
          }
      }
      return outVal;
  }
}