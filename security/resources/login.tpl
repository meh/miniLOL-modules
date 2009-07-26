<center>
<div class="login">
    <div style="margin-bottom: 10px;">Write the admin password and login :3</div>

    <form onsubmit="miniLOL.module.execute('security', [{ login: true, do: true, password: $('login_password').value }]); return false;">
        <input style="margin-right: 10px;" id="login_password" type="password"/><input type="submit" value="login"/>
    </form>
</div>
</center>
