export function nullcheck(checklist) {
    let coptlist = [...checklist];
    let checksize = coptlist.length;

    for (let i = 0; i < checksize; i++) {
        let item = coptlist[i];

        let checkflag = false;

        // console.log("item.inval : " + item.inval + " : " + item.msg);

        if (typeof item.inval === "string") {
            checkflag =
                item.inval !== "" && item.inval !== null && item.inval !== undefined ?
                true :
                false;
            //console.log("item.inval : " + item.inval + " checkflag : " + checkflag);
        } else if (typeof item.inval === "number") {
            checkflag = item.inval !== 0 ? true : false;
            //console.log("item.inval : " + item.inval + " checkflag : " + checkflag);
        }

        if (!checkflag) {
            alert(item.msg);
            return false;
        }
    }

    return true;
}