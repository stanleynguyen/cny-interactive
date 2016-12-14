# CNY Display Server

### endpoints

```javascript
//this endpoint is for getting all the wishes in db
url: '/api/wishes/all'
method: GET
```

```javascript
//this endpoint is for getting all filtered, ready to be displayed wishes
url: 'api/wishes/filtered'
method: GET
```

```javascript
//this endpoint is for getting all unfiltered wishes
url: '/api/wishes/unfiltered'
method: GET
```

```javascript
//this endpoint is for approving a wish
url: '/api/wishes'
method: POST
params: { id: <id-of-the-wish> }
```

```javascript
//this endpoint is for disapproving a wish (and delete it)
url: '/api/wishes'
method: DELETE
params: { id: <id-of-the-wish> }
```
