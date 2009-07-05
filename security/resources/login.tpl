<center>
<div class="login">
    <div style="margin-bottom: 10px;">Write the admin password and login :3</div>

    <form onsubmit="miniLOL.go('#module=security&login&do&password='+$('login_password').value); return false;">
        <input style="margin-right: 10px;" id="login_password" type="password"/><button onclick="miniLOL.go('#module=security&login&do&password='+$('login_password').value); return false;">login</button>
    </form>
</div>
</center>
