function flag = houghOri(fedge)
% hough变换椭圆检测
% fedge 传入的只包含边缘的二值图
% flag 输出是否为椭圆（0,1）
[hei,wid]=size(fedge);          %高和宽
% 针对于旋转的图片位置，设置一个角度sita，从0-90

% 设置椭圆的(x0,y0)
minofx0=max(round(wid/2)-30,1);
maxofx0=min(round(wid/2)+30,wid);       % 设置x的最大值为wid/2 +30，不超过wid
minofy0=max(round(hei/2)-30,1);         % 设置y的最小值为hei/2 -30，不小于1
maxofy0=min(round(hei/2)+30,hei)+20;    % 设置y的最大值为hei/2 +30，不超过hei

% step_angle = 0.1;
% size_angle = round(pi/2*step_angle);% 切分圆  设置0-90°变化 此时的a表示为a/sin(k*step_angle),b

% 设置椭圆的a,b
minofb=10;                                  % b的最小值为10
minofa=round(wid/2.5);                      % a的最小值为wid/2.5
maxab = round(sqrt((hei^2 + wid^2))/2);     % a,b的最大值均为对角线的一般

%设置步长
scalor=1;

[num,~] = size(find(fedge==1));     % num保存所有的边缘像素点的个数

H=zeros(floor((maxofx0-minofx0)/scalor)+1,floor((maxab-minofa)/scalor)+1,...
floor((maxofy0-minofy0)/scalor)+1,floor((maxab-minofb)/scalor)+1);  %定义空矩阵

% 遍历所有参数椭圆
% 遇到处于其上的点对相应的变量进行+1操作，数值表示处于该参数定义的椭圆上的点的个数
for x=1:hei
    for y=1:wid
        temp=fedge(x,y);
        if temp==1
            for a=minofa:scalor:maxab                   % 从minofa到maxofa每次加scalor
                for b=minofb:scalor:maxab
                    for x0=minofx0:scalor:maxofx0
                        for y0=b:scalor:maxofy0
                            temp=((y-y0)/b)^2+((x-x0)/a)^2;
                            if abs(temp-1)<=0.4                         % 设置容错0.4（可调），在此范围内的均视为在该参数定义的椭圆上
                                 xtemp=floor((x0-minofx0)/scalor)+1;
                                 atemp=floor((a-minofa)/scalor)+1;
                                 ytemp=floor((y0-minofy0)/scalor)+1;
                                 btemp=floor((b-minofb)/scalor)+1;
                                 H(xtemp,atemp,ytemp,btemp)=H(xtemp,atemp,ytemp,btemp)+1; % 数值加1
                            end
                        end
                    end
                end
            end
        end
    end
end

% 获取所有可能的椭圆中其上点的个数的最大值
maxofH=max(max(max(max(H))));

disp(['max:' num2str(maxofH) ' num:' num2str(num)]);
% 若最大值小于整体的0.85（可调）倍，设为不存在椭圆
if(maxofH < num*0.85)
    flag = 0;
else
    flag = 1;
end
