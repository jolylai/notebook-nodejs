---
title: Shell
group:
  title: 构建
  path: /build
---

## 变量

### 定义变量

定义变量时，变量名不加美元符号（\$），如：

```shell
your_name="qinjx"
```

注意，变量名和等号之间不能有空格，这可能和你熟悉的所有编程语言都不一样。
除了显式地直接赋值，还可以用语句给变量赋值，如：

```shell
for file in `ls /etc`
```

### 使用变量

使用一个定义过的变量，只要在变量名前面加美元符号即可，如：

```shell
your_name="qinjx"
echo $your_name
echo ${your_name}
```

变量名外面的花括号是可选的，加不加都行，加花括号是为了帮助解释器识别变量的边界，比如下面这种情况：

```shell
	for skill in Ada Coffe Action Java; do
		echo "I am good at ${skill}Script"
	done
```

如果不给 skill 变量加花括号，写成 `echo "I am good at $skillScript"`，解释器就会把`$skillScript` 当成一个变量（其值为空），代码执行结果就不是我们期望的样子了。

推荐给所有变量加上花括号，这是个好的编程习惯。IntelliJ IDEA 编写 shell script 时，IDE 就会提示加花括号。

### 重定义变量

已定义的变量，可以被重新定义，如：

```shell
	your_name="qinjx"
	echo $your_name

	your_name="alibaba"
	echo $your_name
```

这样写是合法的，但注意，第二次赋值的时候不能写\$your_name="alibaba"，使用变量的时候才加美元符。

### 时间

获取当前时间：2020-01-03-14-24-27

```shell
echo $(date +%Y-%m-%d-%H-%M-%S)
```

## 流程控制

### 条件判断

**if**

```shell
if condition
then
	command1
	command2
	...
	commandN
fi
```

写成一行（适用于终端命令提示符）：

```bash
if `ps -ef | grep ssh`;  then echo hello; fi
```

末尾的 fi 就是 if 倒过来拼写，后面还会遇到类似的

**if else**

```bash
if condition
then
	command1
	command2
	...
	commandN
else
	command
fi
```

**if else-if else**

```shell
if condition1
then
	command1
elif condition2
	command2
else
	commandN
fi
```

### 循环

**for**

```shell
for var in item1 item2 ... itemN
do
	command1
	command2
	...
	commandN
done
```

写成一行：

```bash
for var in item1 item2 ... itemN; do command1; command2… done;
```

C 风格的 for

```shell
for (( EXP1; EXP2; EXP3 ))
do
	command1
	command2
	command3
done
```

**while**

```shell
while condition
do
	command
done
```

**无限循环**

```shell
while :
do
	command
done
```

或者

```shell

while true
do
	command
done
```

或者

```shell
for (( ; ; ))
```

**until**

```shell
until condition
do
	command
done
```

**case**

```shell
case "${opt}" in
	"Install-Puppet-Server" )
		install_master $1
		exit
	;;

	"Install-Puppet-Client" )
		install_client $1
		exit
	;;

	"Config-Puppet-Server" )
		config_puppet_master
		exit
	;;

	"Config-Puppet-Client" )
		config_puppet_client
		exit
	;;

	"Exit" )
		exit
	;;

	* ) echo "Bad option, please choose again"
esac
```

case 的语法和 C family 语言差别很大，它需要一个 esac（就是 case 反过来）作为结束标记，每个 case 分支用右圆括号，用两个分号表示 break

## 用户输入

### 选择

语法

```shell
select variable in value_list
do
    statements
done
```

选择 `patch minor major "Specific Version"` 四个值中的一个

```shell
select VERSION in patch minor major "Specific Version"
do
    echo ${VERSION}
done
```

### 输入

Yes/No

```shell
read -p "Release 2020 - are you sure? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ || -z $REPLY ]];
then
  echo ${REPLY}

else
  echo Cancelled
fi
```

输入不在终端显示

```shell
read -p "Input passwd: " -s Passwd
echo Password is $Passwd.
```

延迟五秒，没有输入将自动退出返回错误退出值.

```shell
#!/bin/bash
if read -t 5 -p "please enter your name:" name
then
    echo "hello $name ,welcome to my script"
else
    echo "sorry,too slow"
    exit 1
fi
```

读取限定字符

```shell
#!/bin/bash
read -n1 -p "Do you want to continue [Y/N]?" answer
case $answer in
Y | y)
      echo "fine ,continue";;
N | n)
      echo "ok,good bye";;
*)
     echo "error choice";;
esac

read -p "Input a word:" -n 5 Word1 Word2
echo $Word1 $Word2
```

5. 指定行分界符

```shell
#输入，直到输入q，将自动退出
read -dq -p "Input some words end with q:" word ok
echo word: $word ok: $ok
#输入 10 9 8 7 abcq
#结果: word: 10 ok: 9 8 7 abc
```

6. 重定向或管道

```shell
# -r取消反义, 按实际显示行来输入
while read -r line
do
    echo $line
done < $testfile
# 以管道作为输入
cat $testfile | while read -r line
do
    echo $line
done
```

::: tip 参数

- `-a` 数组变量
  将内容读入到数组变量中. 如 read -a array; echo \${#array[@]}
- `-d` 行定界符
  指定行定界符,一般是换行符.注意, 多变量赋值分界符依然是空格 tab,但-dq 可以使用 q 作为结束而不是按下确定.
- `-e`
  只用于互相交互的脚本，它将 readline 用于收集输入行。
- `-i` text
  Mingw 就不支持.
- `-n` 读取指定字符个数 nchars
  用于限定最多可以有多少字符(包括空格等!)可以作为有效读入。例如 echo –n 5 value1 value2，如果我们试图输入 12 34，则只有前面有效的 12 3，作为输入，实际上在你输入第 5 个字符 3 后，就自动结束输入。
- `-N` nchars
  真实地读取指定字符个数. Mingw 就不支持.
- `-p` 提示语句 prompt
  指定提示语句，如 read –p "… my promt?" value. 提示语句会在同一行中.
- `-r` 取消反义符作用 Backslash does not act as an escape character.
  取消反义号作用, 影响本来取消换行的效果. 在参数输入中，我们可以使用\表示没有输入完，换行继续输入，如果我们需要行最后的\作为有效的字符，可以通过-r 来进行。此外在输入字符中，我们希望\n 这类特殊字符生效，也应采用-r 选项。
- `-s` 不显示输入内容
- `-t` 等待时间 timeout
  用于表示等待输入的时间，单位为秒，等待时间超过，将继续执行后面的脚本，注意不作为 null 输入，参数将保留原有的值. 此时 read 命令返回非零退出. 十分重要的防止脚本停止的选项!
- `-u` fd 文件句柄
  从指定文件句柄中读取. 参见第一个例子.
  在 read 命令行中也可以不指定变量.如果不指定变量，那么 read 命令会将接收到的数据放置在环境变量 REPLY 中。
  :::

## 🌰

```shell
git checkout master
git merge develop

echo "Select a option to release (input a serial number)："
echo

select VERSION in patch minor major "Specific Version"
  do
    echo
    if [[ $REPLY =~ ^[1-4]$ ]]; then
      if [[ $REPLY == 4 ]]; then
        read -p "Enter a specific version: " -r VERSION
        echo
        if [[ -z $REPLY ]]; then
          VERSION=$REPLY
        fi
      fi

      read -p "Release $VERSION - are you sure? (y/n) " -n 1 -r
      echo

      if [[ $REPLY =~ ^[Yy]$ || -z $REPLY ]];
      then
        npm run build

        if [[ `git status --porcelain` ]];
        then
          git add -A
          git commit -am "build: compile $VERSION"
        fi
        # bump version
        npm version $VERSION
        NEW_VERSION=$(node -p "require('./package.json').version")

        # npm release
        npm publish

        echo Releasing ${NEW_VERSION} ...

        echo "✅ Released to npm."

        # github release
        git add -A
        git commit -m "release v${NEW_VERSION}"
        git origin master
        git push origin refs/tags/${NEW_VERSION}

        # async develop
        git checkout develop
        git rebase master
        git push origin develop

        echo "✅ Released to Github."
      else
        echo Cancelled
      fi
      break
    else
      echo Invalid \"${REPLY}\"
      echo "To continue, please input a serial number(1-4) of an option."
      echo
    fi
  done
```
