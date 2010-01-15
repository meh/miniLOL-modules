<?php

if (isset($_REQUEST['login'])) {
    echo <<<HTML

<center>
<div class="login">
    <div style="margin-bottom: 10px;">Write the admin password and login :3</div>

    <form onsubmit="miniLOL.module.execute('security', [{ login: true, do: true, password: $('login_password').value }]); return false;">
        <input style="margin-right: 10px;" id="login_password" type="password"/><input type="submit" value="login"/>
    </form>

    <script>$('login_password').focus();</script>
</div>
</center>

HTML;
}
else if (isset($_REQUEST['change'])) {
    $algos = '';

    $algos .= '<option value="text">Plain</option>';
    foreach (hash_algos() as $hash) {
        $algos .= '<option value="' . $hash . '">' . strtoupper($hash) . '</option>';
    }

    echo <<<HTML

<center>
<div class="change">
    <div style="margin-bottom: 10px;">Write the new password and choose the hashing algorithm.</div>

    <form onsubmit="miniLOL.module.execute('security', [{ change: true, do: true, password: $('change_password').value, type: $('change_type').getElementsByTagName('option')[$('change_type').selectedIndex].value}]); return false;">
        <input style="margin-right: 10px;" id="change_password" type="password"/><select id="change_type">{$algos}</select><br/><input style="margin-top: 5px;" type="submit" value="change"/>
    </form>

    <script>$('change_password').focus();</script>
</div>
</center>
   

HTML;
}

?>
