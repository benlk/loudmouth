# loudmouth
An IRC bot written in node.JS that *yells* at people when they use buzzwords

### Getting started

##### Clone
```bash
git clone https://github.com/egladman/loudmouth.git && cd loudmouth
```
##### Install Dependencies
```bash
npm install
```



##### Start

There are **3 optional** parameters and **2 required** parameters

required
  - admin
  - channel


optional
  - nick
  - server
  - port


###### Example

```bash
node server.js --channel='#foo' --admin='bar,baz'

#OR

node server.js --nick='qux' --channel='#foo' --server='bar' --port=1234 --admin='baz'
```

---

##### Default Configuration

server: `irc.freenode.net`

port: `6667`

nick: `loudmouth`

---

##### Admin Commands

add `foo` to the list of buzzwords
```
.addbuzz foo
```

---

Tested on node `v4.2.6`

Contributions and/or feature requests are welcomed. Feel free to report issues.

